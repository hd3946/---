import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import io from 'socket.io-client';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fade:false,
    curr_user:null,  //현재 유저        
    messages: [],
    participants: [],
    placeholder: '',
    login:false,
    typostate: '',
    socket: io('http://localhost:3000/'),
    //socket: io('https://fc02ebac.ngrok.io'), // socket connection to server
  },
  mutations: {
    newMessage: (state, message) => {
      message.timestamp = message.timestamp.toISOString();
      state.messages = [...state.messages, message];
    },
    setParticipants: (state, participants) => {
      state.participants = participants;  
    },
    newarrayMessages: (state, message) => {  //여러 메시지 저장
      message.map(message => {
        message.timestamp = moment(message.timestamp).toISOString();
        state.messages = [...state.messages, message];
      })
    },
    setMessages: (state, messages) => {  //초기 메시지 저장
      messages.map(message => {
        message.timestamp = moment(message.timestamp).toISOString();
      })
      state.messages = messages;
    },
    setChatTitle: (state, title) => {
      state.chatTitle = title;
    },
    setPlaceholder: (state, placeholder) => {
      state.placeholder = placeholder;
    }
  },
  actions: {

  },
  getters: {
    getparticipants(state) {
      let now = state.participants;
      return now;
    },
    gettypo(state) {
      let now = state.typostate;
      return now;
    },
    getParticipantById: (state) => (id) => {
      let curr_participant;
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
