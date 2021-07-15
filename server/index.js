import express from'express';
import fs from 'fs';
import "./env";
import upload from "./db/db_path"                     // db 이미지 업로드 경로 
import cors from "cors";    
import cookieParser from 'cookie-parser';   
import tryDF from './dialogflow/dialogflow';          // 다이어플로우 
import twit from './twitter/twitter';
import path from 'path';

const mysql_dbc = require('./db/database')();   //db 연결 
const connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

const app = express();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT,function(){
  console.log(`✅ Server running on http://localhost:${PORT}`);
})
const io = require('socket.io')(server);

app.use(cors());
app.use(cookieParser()); 

app.use(express.static(path.join(__dirname, 'uploads')));
//app.use(express.static('dist'));   //정적 파일 제공 

//이미지파일 업로드
app.post('/upload', upload.single('file'), function(req, res){
  const sql = 'INSERT INTO Persons (TITLE,TYPE,URL) VALUES(?, ?, ?)';
  const ngrok_path = '/uploads/' + req.file.filename
  const params = ['User', 'picture', ngrok_path];
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
  const filename = req.params.name;
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

// app.get('/test', function (req, res) {
// res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']); 
// res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly'); 
// res.append('Warning', '199 Miscellaneous warning');
// twit('BTS_twt');
//   const stmt = 'SELECT * from Persons';
//   connection.query(stmt, function(err, rows, fields) {
//   if (!err){
//     res.send(rows);
//   }   
//   else
//     console.log('Error while performing Query.', err);
//   })
// });

app.get('/find', function (req, res) {
  const params = 'Blackpink';
  const stmt = 'SELECT * from Persons WHERE TITLE = ?';
    connection.query(stmt, params ,function(err, rows , fields) {
    if (!err){
      res.send(rows);
    }   
    else
      console.log('Error while performing Query.', err);
    })
});

let socket_ids = [];

function registerUser(socket,nickname){
    if(nickname != undefined) delete socket_ids[nickname];
      socket_ids[socket.id] = nickname;  
}

io.on('connection', (socket) => {

  socket.on('newUser',(data) => {
    registerUser(socket,data.data);
    // 새로운 유저 값 보내기
    io.emit('newUser', (socket_ids[socket.id]));          

    io.emit('userlist',{
      userid: Object.keys(socket_ids),
      username: Object.values(socket_ids)
    });

    //  변경 
    socket.on('changename',(nickname) => {   
      registerUser(socket,nickname.data);
      io.emit('userlist',{
        userid: Object.keys(socket_ids),
        username: Object.values(socket_ids) 
      });
    });
  });

  socket.on('typo', async data => {
    console.log("typo",data)
    io.emit('typo',(data));
  }); 

  socket.on('disconnect',() => {
      if(socket.id != undefined){
        io.emit('disconnect',socket_ids[socket.id]);    
        delete socket_ids[socket.id];     
      }   
  });
  
  socket.on('chat-message', async data => { 
            
      // 나를 제외한 사용자 메시지 전송     
      socket.broadcast.emit('chat-message', {
        content: data.message,
        id:socket.client.id    //해당 유저로 변경  
      });   
 
      //// ##############
      //// 봇에게 대화전송 
      if(data.message.indexOf('#') != -1){  
        // 다이어로그플로우 값 받아오기
        const bot_message  = await tryDF(data.message);  
        //다이어플로우 봇 대답 전달
        io.emit("bot-message", {   
          message:bot_message.message
        }); 

        //사진 및 영상 검색  값 보내기      
        if(data.message.indexOf('사진') != -1){     
          dbfind("User");  
        }  
        
        if(data.message.indexOf('트위터') != -1){  
          const result = await queryPromise1(bot_message.parameters); 
          const content_data = await twit(result);
          io.emit("twit-message", {   
            message: content_data
          }); 
        } 
      }  
  });
}); 

const queryPromise1 = (data) =>{
  return new Promise((resolve, reject)=>{
    const params = data;
    const stmt = 'SELECT * FROM twitter where name = ?'; 
    connection.query(stmt,params, (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results[0].twitterid);
      });
  });
};

async function dbfind(find){
  let params = find;
  let stmt = 'SELECT * from Persons WHERE TITLE = ?'; 
  connection.query(stmt, params ,function(err, rows , fields) {
  if (!err){
    console.log('실행', rows);
    io.emit('searchidol',(rows));         // 전송
  }     
  else
    console.log('Error while performing Query.', err);
  })
}