import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import io from 'socket.io-client';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ChatBotName:'Chat-Bot',
    fade:false,
    curr_userID:'',
    curr_user:'',  //현재 유저        
    messages: [],
    participants: [],
    placeholder: '',
    login:false,
    typostate: '',
    socket: io('http://localhost:3000/'),
    //socket: io('https://fc02ebac.ngrok.io'), // socket connection to server
  },
  mutations: {
    //현재 내아이디 셋팅
    setMyUserId: (state, id) => { 
      state.curr_userID = id
    },
    //챗봇 메시지 객체 설정
    setChatBotMessage: (state, content) =>{  
      state.messages.push({
        name : state.ChatBotName,
        content : content, 
        participantId : 1,
        timestamp : moment(),
        uploaded : false,
        viewed : false 
      });
    },
    //나의 메시지 객체 설정
    setUserMessage: (state, content) => {
      state.messages.push({
        name : state.curr_user,
        content : content, 
        participantId : state.curr_userID,
        timestamp : moment(),
        uploaded : false,
        viewed : false 
      });
    },
    //상대방 유저 메시지 객체 설정
    setOtherUserMessage: (state, data) => {
      state.messages.push({
        name : state.curr_user,
        content : data.content, 
        participantId : data.id,
        timestamp : moment(),
        uploaded : false,
        viewed : false 
      });
    },
    //상대방 유저 메시지 객체 설정
    setTwitMessage: (state, data) => {
      const db = data.message;
      state.messages.push({
        content: db.text, 
        participantId: 1,
        timestamp: moment(),
        created_at: db.created_at,       
        description: db.description,
        media_url:db.media_url,
        url: db.url,
        username: db.name,
        profile_image: db.profile_image,
        viewed: "twit"
      });
    },
    //상대방 유저 메시지 객체 설정
    setPictureMessage: (state, data) => {
      const image = [];
      data.map(x => {
          image.push(x.URL)
      });
      state.messages.push({
        content: image, 
        participantId: 1,
        timestamp: moment(),
        uploaded: false,
        viewed: 'photo'
      });
    },
    newMessage: (state, message) => {
      //message.timestamp = message.timestamp.toISOString();
      state.messages = [...state.messages, message];
    },
    //참석자 셋팅
    setParticipants: (state, participants) => {
      state.participants = participants;  
    },
    //여러 메시지 저장
    newarrayMessages: (state, message) => {  
      message.map(message => {
        message.timestamp = moment(message.timestamp).toISOString();
        state.messages = [...state.messages, message];
      })
    },
     //초기 메시지 저장
    setMessages: (state, messages) => { 
      messages.map(message => {
        message.timestamp = moment(message.timestamp).toISOString();
      })
      state.messages = messages;
    },
    setPlaceholder: (state, placeholder) => {
      state.placeholder = placeholder;
    }
  },
  //TEST 비동기 처리
  actions: { 
    asyncsetMessage: (context) => { 
      return setTimeout(() => {
        context.commit('setMessage2');
      }, 1000);
    }
  },
  getters: {
    //내 ID 확인
    getMyUserId(state) {
      return state.curr_userID;
    },
    // 참가자 인원 목록
    getparticipants(state) {
      let now = state.participants;
      return now;
    },
    // 현재 참가자 인원 (챗봇 인원 빼기)
    getparticipantsCount(state) {
      let now = state.participants.length-1;   
      return now;
    },
    //타이핑 유저 확인
    gettypo(state) {
      let now = state.typostate;
      return now;
    },
    //해당 아이디 => 닉네임 찾기
    getParticipantById: (state) => (id) => {
      let curr_participant = '';
      state.participants.forEach(participant => {
        if(participant.id == id){
          curr_participant = participant;
        }
      })
      return curr_participant;
    },
    messages: (state) => {
      let messages = [];
      state.messages.forEach(message => {
          let newMessage = { ...message };
          newMessage.timestamp = moment(newMessage.timestamp);
          messages.push(newMessage);
      })
      return messages;
    },
    
  }
})
