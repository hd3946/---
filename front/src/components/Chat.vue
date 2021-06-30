<template>
    <div class="w-full h-full">
      <Header class="message-header"/>
      <MessageDisplay :colors="colors" class="message-display"/>
      <MessageInput class="message-input"/>
    </div>
</template>
<script>
import Header from './Header.vue'
import MessageDisplay from './MessageDisplay.vue'
import MessageInput from './MessageInput.vue'
import { mapMutations } from 'vuex'
import store from '../store'
import * as moment from 'moment';
import { mapGetters } from 'vuex';

export default {
    name: 'Chat',
    store,
    components:{
        Header,
        MessageDisplay,
        MessageInput,
    },
    props: {    
        messages: {
            type: Array,
            required: true
        },
        colors: {
            type: Object,
            required: true
        },    
    },
    methods: {
        ...mapMutations([
            'setParticipants',
            'setMessages',
            'setPlaceholder',
            'setChatTitle',
             'newMessage',
        ]),
    },
    watch: {
        messages: function(){
            this.setMessages(this.messages);
        },
    },
    data() {  // data
        return {         
            socket:this.$store.state.socket,
            newmsg:[],
            participants:[]
        };
    },
    created(){
    this.setChatTitle(this.chatTitle);  //타이틀 셋팅
    let first =[
                {
                    name: 'TWICE',
                    id: 1
                }, 
                {
                    name: 'ME',
                    id: 2
                },      
              ]
      this.participants = first;
      this.setParticipants(this.participants);   
      this.socket.on("userlist",(data) =>{
      let first =[
                {
                    name: 'TWICE',
                    id: 1
                }, 
                {
                    name: 'ME',
                    id: 2
                },      
              ]
      this.participants = first;
            for(var i=0;i<data.userid.length;i++){
                let myid = data.userid[i];
                let myname = data.username[i];
                let participant = {
                    id: myid,
                    name: myname,
                }
                this.participants.push(participant);
              }
        this.setParticipants(this.participants);     
        console.log("안돼제발",this.participants);                
    });
      
        //닉네임 서버로 전송2
        this.socket.on("newUser", name => { 
            var enterMsg = name + '님이 입장하셨습니다.';
            
             var system_message =  
            {
                content: enterMsg, 
                participantId: 1,        //구분
                timestamp: moment(),
                viewed: false
            }
            this.newMessage(system_message);  
        });   
        
        this.socket.on("chat-message", (data) => { // when "chat-message" comes from the server             
            console.log('msg received from server',data);
            
            this.newmsg.push(data.data);
         
            data.data.timestamp = moment();     
            this.newMessage(data.data);
  
        });
        this.socket.on("bot-message", name => { 
            var outMsg = name.message;
            console.log(outMsg);
             var system_message =  
            {
                content: outMsg, 
                participantId: 1,        //구분
                timestamp: moment(),
                viewed: false
            }
            this.newMessage(system_message);  
        });
        this.socket.on("disconnect", name => { 
            var outMsg = name + '님이 나가셧습니다.';
        
             var system_message =  
            {
                content: outMsg, 
                participantId: 1,        //구분
                timestamp: moment(),
                viewed: false
            }
            this.newMessage(system_message);  
        });   
    },
}
</script>

<style scoped>
    .message-header{
        height: 15%;
    }
    .message-display{
        height: 75%;
    }
    .message-input{
        height: 10%;
    }
   
</style>