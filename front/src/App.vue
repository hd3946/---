<template>
<div class="relative md:max-auto">
  <div> 
    <span class="decoration-clone md:decoration-slice">
      Hello World
    </span>
  </div>
  <div v-if="this.$store.state.login" >
      <div v-if="this.$store.state.fade" id="sidebar" class="md:min-h-full absolute bottom-0 right-0">
            <Participant/>
      </div>
      <div class="chat-container md:max-w-full max-h-full">
        <Chat
        :messages="messages"
        :onMessageSubmit="onMessageSubmit"
        :colors="colors">
        </Chat>
      </div>
  </div>

  <div v-else class="float-right h-2/6 w-2/6"><login/></div>

  </div>
</template>

<script>
import Chat from './components/Chat.vue'
import login from './components/login'
import Participant from './components/participaint'
import moment from 'moment'
import twitDisplay from './components/twitDisplay'

export default {
  name: 'app',
  components: {
    Chat,
    login,
    Participant,
    twitDisplay
  },
  created(){
       
  },
  data(){
    return {
      messages: [
        {
          content: "안녕~안녕~ 트둥이입니다.~ 만나서 반가워요", 
          participantId: 1,
          timestamp : moment(),
          viewed: false       //텍스트 및 이미지 구분
        },
      ],
      styleObject: {
         display: 'none',
      },
      colors:{
        message:{
          myself: {
            bg: '#fff',
            text: '#bdb8b8'
          },
          others: {
            bg: '#fb4141',
            text: '#fff'
          },
          messagesDisplay: {    
            bg: '#f7f3f3'
          }
        },
      },
    }
  },
  methods: {
    onMessageSubmit(message){
      this.messages.push(message);
      setTimeout(() => {
        message.uploaded = true
      }, 2000)
    },
    
    isSupportNotification () {
      return process.browser && window && 'Notification' in window;
    },
    
    getNotificationPermission () {
 

    if (!this.isSupportNotification()) {
      this.isAllowNotification = false;
      return Promise.reject(new Error('not_supported'));
    }

    if (Notification.permission === 'granted') {
      var notification = new Notification("Hi there!");
      this.isAllowNotification = true;
      return Promise.resolve();
    }
    else if (Notification.permission !== 'denied' || Notification.permission === 'default') {
      return Notification.requestPermission().then(result => {
        if (result === 'granted') {
          this.isAllowNotification = true;
        }
      });
    }
  },
  createForegroundNotification (title, { body }) {
    const notification = new Notification(title, {
    body,
  });

  notification.onshow = () => {
    setTimeout(() => notification.close(), 5000);
  };
  notification.onerror = e => {
    console.error(e);
  };
  },
      getGeo() {
        if (!this.isSupportNotification()){
          return;
        }
        this.getNotificationPermission();
        if (!this.isAllowNotification) {
          return;
        }
        console.log("실행");
            if (Notification.permission !== 'granted') {
                alert('notification is disabled');
            }
            else {
                var notification = new Notification('Notification title', {
                    body: 'Notification text',
                });
 
                notification.onclick = function () {
                    window.open('http://google.com');
                };
            }
      this.createForegroundNotification('님이 메세지를 보냈어요.', {
        body: "보내지는건가",
    });
  },
}
}
</script>

<style>

#sidebar {
  background: #bbb7b7;
  opacity: 0.8;
  display: block;
  /* display: none; */
  width:70%
}
</style>
