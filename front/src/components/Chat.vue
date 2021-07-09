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
import { mapMutations,mapActions,mapGetters } from 'vuex'
import store from '../store'
import * as moment from 'moment'; 

export default {
    name: 'Chat',
    store,
    components:{
        Header,
        MessageDisplay,
        MessageInput,
    },
    props: { 
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
            'setMyUserId',
            'setChatBotMessage',
            'setOtherUserMessage'
        ])
    }, 
    data() {  // data
        return {         
            socket:this.$store.state.socket,
            newmsg:[],
            participants:[], 
        };
    },
    created(){ 
      this.socket.on("userlist",(data) =>{
      const first =[
            {
                name: 'Chat-Bot',
                id: 1
            }     
        ]
      this.participants = first;
        for(var i=0;i<data.userid.length;i++){
            const myid = data.userid[i];
            const myname = data.username[i];
            const participant = {
                id: myid,
                name: myname,
            }
            this.participants.push(participant);

        }
        this.setMyUserId(this.socket.id);   //My소켓ID 설정
        this.setParticipants(this.participants);   // 참가자 추가    
    });
      
        //닉네임 서버로 전송2
        this.socket.on("newUser", name => { 
            const enterMsg = name + '님이 입장하셨습니다.'; 
            this.setChatBotMessage(enterMsg);  
        });   
        
        //서버로 부터 다른사람 메시지 받아오기
        this.socket.on("chat-message", (data) => { // when "chat-message" comes from the server             
            console.log('msg received from server',data); 
            this.setOtherUserMessage(data);
        });

        this.socket.on("bot-message", name => { 
            const Msg = name.message; 
            this.setChatBotMessage(Msg);    
        });
        
        this.socket.on("disconnect", name => { 
            const outMsg = name + '님이 나가셧습니다.~!';
            this.setChatBotMessage(outMsg); 
            //const system_message = this.$store.state.message;   
            //this.newMessage(system_message);  
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