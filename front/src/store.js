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
    message:{
      name: '',
      content: '', 
      participantId: 0,
      timestamp: '',
      uploaded: false,
      viewed: false
    },
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
      state.message.name =  state.ChatBotName,
      state.message.content = content, 
      state.message.participantId = 1,
      state.message.timestamp = moment(),
      state.message.uploaded = false,
      state.message.viewed = false 
    },
    //유저 메시지 객체 설정
    setUserMessage: (state, content) => {
      state.message.name =  state.curr_user,
      state.message.content = content, 
      state.message.participantId = state.curr_userID,
      state.message.timestamp = moment(),
      state.message.uploaded = false,
      state.message.viewed = false 
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
    getMessage: (state) => {
      let now = state.message.name;
      return now;
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
