<template>
    <div class="container-message-manager w-full flex">
        <div class="container-send-message inline-flex" @click="chooseFiles()" >
            <v-icon name="upload" class="w-16" base-class="icon-send-message" :style="{color: 'red'}"></v-icon>
            <input type="file" ref="file" id="fileUpload" name="file" class="img-button" @change="fileupload" accept="image/*" hidden>
        </div>
        <div class="message-text-box inline-flex w-full flex-1">
            <input  class="message-input w-full text-5xl" :placeholder="placeholder" tabIndex="0" contenteditable="true" 
            v-model="textInput"  @keyup.enter="sendMessage"/>
        </div>
        <div class="container-send-message" @click.prevent="sendMessage">
            <v-icon name="send" class="w-16" base-class="icon-send-message" :style="{color: 'red'}"></v-icon>
        </div>
    </div>    
</template>
<script>
import { mapMutations,mapGetters } from 'vuex';
import axios from 'axios';
import moment from 'moment';
import io from 'socket.io-client';

export default {
    name:'MessageInput',
    props:{
        onMessageSubmit: {
            type: Function,
            required: false,
            default: () => false
        },
    },
    data(){
        return {
            socket:this.$store.state.socket,
            textInput: '',
        }
    },
    created(){
        this.socket.on("typo",(data) =>{
            console.log("?",data)
            this.$store.state.typostate = data.data;
        });
        //사진 출력
        this.socket.on('searchidol', db => {
           
            let image = [];
            db.map(x => {
                image.push(x.URL)
            });

            let message = {
                    content: image, 
                    participantId: 1,
                    timestamp: moment(),
                    uploaded: false,
                    viewed: 'photo'
                }
            
            this.newMessage(message);           
        })
        //트위터
        this.socket.on('twit-message', data => {
            
            var db = data.message;
            let message = {
                    content: db.text, 
                    participantId: 1,
                    timestamp: moment(),
                    created_at: db.created_at,       //추가되는 변수
                    description: db.description,
                    media_url:db.media_url,
                    url: db.url,
                    username: db.name,
                    profile_image: db.profile_image,
                    viewed: "twit"
                }        
            console.log(message);
            this.newMessage(message);              
        })
        moment.locale('pt-br')
    },
    computed: {
        ...mapGetters([
            'gettypo',
            'getparticipants',
        ]),
        placeholder: function(){
            return this.$store.state.placeholder;
        },
    },
    watch:{
        //입력중 기능
        textInput(){
            if((this.textInput != null) && (this.texting != 0)){        
                this.$store.state.typostate = this.$store.state.curr_user + '입력중...';
                this.texting = 0;
                 //서버로 전송
                this.socket.emit("typo", {
                    data: this.$store.state.typostate        
                });      
            }
            if(this.textInput == null){
                this.texting = -1;
            }           
        }
    },
    methods: {
        ...mapMutations([
            'newMessage',
            'messages',
            'setMessages',
            'newarrayMessages',
            'setParticipants'
        ]),
        fileupload(e){
            //console.log(e);
            const formData = new FormData();
            formData.append('file',this.$refs.file.files[0]);
            console.log(this.$refs.file.files[0]);
            try{
                axios.post('http://localhost:3000/upload', formData);
                //axios.post('https://fc02ebac.ngrok.io/upload', formData);              
            }
            catch(err){
                console.log(err);
            }
        },
        chooseFiles() {
            document.getElementById("fileUpload").click()
        },
        sendMessage(){
            if(this.textInput){
                let inputLen = this.textInput.length
                let inputText = this.textInput
                if(this.textInput[inputLen-1] == '\n'){
                    inputText = inputText.slice(0, inputLen-1)
                }
                let message = {
                    content: inputText, 
                    participantId: 2,
                    timestamp: moment(),
                    uploaded: false,
                    viewed: false
                }
                this.$store.state.typostate = null;
                this.textInput = null;
                this.socket.emit("typo", {
                    data: this.$store.state.typostate        
                });
                //서버로 전송
                this.socket.emit("chat-message", {
                    data: message        
                });
                
                this.onMessageSubmit(message);
                this.newMessage(message);
                
            }
        }, 
    }
   
}
</script>
<style scoped>
.container-message-manager{
    background: #fff;
    align-items: center;
    -webkit-box-shadow: 0px -2px 40px 0px rgba(186,186,186,0.67);
    box-shadow: 0px -2px 40px 0px rgba(186,186,186,0.67);
}
.message-text-box{
    overflow: hidden;
}
.message-input{
    resize: none;
    border: none;
    outline: none;
    box-sizing: border-box;
    font-weight: 400;
    line-height: 1.33;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #565867;
    -webkit-font-smoothing: antialiased;
    /* bottom: 0; */
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: auto;
    text-align: left;
    cursor: text;
}

/* .message-input:empty:before {
  content: attr(placeholder);
  display: block; 
  filter: contrast(15%);
  outline: none;
} */

.message-input:focus{
    outline: none;
}

.icon-send-message{
    cursor: pointer;
    opacity: 0.7;
    transition: 0.3s;
    border-radius: 11px;
    padding: 8px;
}
.icon-send-message:hover{
    opacity: 1;
    background: #eee;
}
.input{
        vertical-align: middle;
}
</style>