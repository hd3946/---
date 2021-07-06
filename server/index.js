import express from'express';
import fs from 'fs';
import "./env";
import upload from "./db/db_path"                     // db 이미지 업로드 경로 
import cors from "cors";    
import cookieParser from 'cookie-parser';   
import tryDF from './dialogflow/dialogflow';          // 다이어플로우 
import answer from './dialogflow/chatanswer';         // 다이어플로우 db답변
import twit from './twitter/twitter';

var mysql_dbc = require('./db/database')();   //db 연결 
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

const app = express();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT,function(){
  console.log(`✅ Server running on http://localhost:${PORT}`);
})
const io = require('socket.io')(server);

app.use(cors());
app.use(cookieParser());
//app.use(express.static('dist'));   //정적 파일 제공 

//이미지파일 업로드
app.post('/upload', upload.single('file'), function(req, res){
  var sql = 'INSERT INTO Persons (TITLE,TYPE,URL) VALUES(?, ?, ?)';
  var ngrok_path = '/uploads/' + req.file.filename
  var params = ['User', 'picture', ngrok_path];
  console.log(ngrok_path); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
  console.log(req.file.path); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
  connection.query(sql, params, function(err, rows, fields){
    if(err){
      console.log(err);
    } else {
      console.log(rows.insertId);
    }
  });
});

// 이미지파일 호스팅 로직 
app.get('/uploads/:name',function (req,res){     
  var filename = req.params.name;
  console.log(__dirname+'/uploads/'+filename);
  fs.exists(__dirname+'/uploads/'+filename, function (exists) {
      if (exists) {
          fs.readFile(__dirname+'/uploads/'+filename, function (err,data){
              res.end(data);
          });
      } else {
          res.end('file is not exists');
      }
  })
});

app.get('/test', function (req, res) {
res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']); 
res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly'); 
res.append('Warning', '199 Miscellaneous warning');
twit('BTS_twt');
  var stmt = 'SELECT * from Persons';
  connection.query(stmt, function(err, rows, fields) {
  if (!err){
    res.send(rows);
  }   
  else
    console.log('Error while performing Query.', err);
  })
});

app.get('/find', function (req, res) {
    var params = 'Blackpink';
    var stmt = 'SELECT * from Persons WHERE TITLE = ?';
    connection.query(stmt, params ,function(err, rows , fields) {
    if (!err){
      res.send(rows);
    }   
    else
      console.log('Error while performing Query.', err);
    })
});

var socket_ids = [];
function registerUser(socket,nickname){
    if(nickname != undefined) delete socket_ids[nickname];
      socket_ids[socket.id] = nickname;  
      //console.log(socket_ids);
}




io.on('connection', (socket) => {

  socket.on('newUser',(data) => {
    registerUser(socket,data.data);
    io.emit('newUser', (socket_ids[socket.id]));           // 새로운 유저 값 보내기

    io.emit('userlist',{
      userid: Object.keys(socket_ids),
      username: Object.values(socket_ids)
      //test:socket.id
    });    
    //  변경
    console.log("몇명이여",socket_ids);
    socket.on('changename',(nickname) => {   
      registerUser(socket,nickname.data);
      io.emit('userlist',{
        userid: Object.keys(socket_ids),
        username: Object.values(socket_ids) 
      });
    });
  });
  socket.on('typo', async data => {
    console.log("data",data)
    io.emit('typo',(data));
  }); 
  socket.on('disconnect',() => {
      if(socket.id != undefined){
        io.emit('disconnect',socket_ids[socket.id]);    
        delete socket_ids[socket.id];     
      }   
  });
  
  socket.on('chat-message', async data => {
 
      data.data.participantId = socket.client.id;        //해당 유저로 변경
      //console.log("test",data.data.participantId);
      
      socket.broadcast.emit('chat-message', (data));  // 나를 제외한 사용자 메시지 전송           
      
      var bot_message  = await tryDF(data.data.content);  // 다이어로그플로우 값 받아오기

      if(data.data.content.includes('#')){   // 봇에게 대화전송
        if(data.data.content.includes('사진')){   //사진 및 영상 검색  값 보내기       
          var param_data = await answer(bot_message.parameters);
          dbfind(param_data);
          if(data.data.content.includes('유저')){dbfind('User')}
             
          console.log("트위터값",param_data);
        }    
        io.emit("bot-message", {   
          message:bot_message.message
        });
     

        if(data.data.content.includes('트위터')){
          var id_data = twit_id_search(data.data.content);
          var content_data = await twit(id_data);
          console.log("트위터값",content_data);
          io.emit("twit-message", {   
            message: content_data
          }); 
        }
      }  
  });
});

function twit_id_search(data){
  if(data.includes('방탄소년단')){
    return 'BTS_twt';//BTS_twt
  //console.log("test,",twit('BTS_twt'));  //JYPETWICE,BTS_twt,ygofficialblink
  }
  else if(data.includes('트와이스')){
    return 'JYPETWICE';//JYPETWICE
  }
  else if(data.includes('블랙핑크')){
    return 'ygofficialblink';//ygofficialblink
  }
  else{
    return 'error';
  }
}

async function dbfind(find){
  var params = find;
  var stmt = 'SELECT * from Persons WHERE TITLE = ?';
  connection.query(stmt, params ,function(err, rows , fields) {
  if (!err){
    console.log('실행', rows);
    io.emit('searchidol',(rows));         // 전송
  }     
  else
    console.log('Error while performing Query.', err);
  })
}