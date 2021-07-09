<template>
    <div class="container-message-manager w-full flex">
        <div class="container-send-message inline-flex" @click="chooseFiles()" >
            <v-icon name="upload" class="box-border w-12" base-class="icon-send-message" :style="{color: 'red'}"></v-icon>
            <input type="file" ref="file" id="fileUpload" name="file" class="img-button" @change="fileupload" accept="image/*" hidden>
        </div>
        <div class="message-text-box inline-flex w-full flex-1">
            <input  class="message-input w-full text-1xl" :placeholder="placeholder" tabIndex="0" contenteditable="true" 
            v-model="textInput"  @keyup.enter="sendMessage"/>
        </div>
        <div class="container-send-message" @click.prevent="sendMessage">
            <v-icon name="send" class="w-12" base-class="icon-send-message" :style="{color: 'red'}"></v-icon>
        </div>
    </div>    
</template>
<script>
import { mapMutations,mapGetters } from 'vuex';
import axios from 'axios';
import moment from 'moment'; 

export default {
    name:'MessageInput',
    props:{ 
    },
    data(){
        return {
            socket:this.$store.state.socket,
            textInput: '',
        }
    },
    created(){
        this.socket.on("typo",(data) =>{ 
            this.$store.state.typostate = data.data;
        });
        //사진 출력
        this.socket.on('searchidol', db => { 
            this.setPictureMessage(db);         
        })
        //트위터
        this.socket.on('twit-message', data => { 
            this.setTwitMessage(data);      
        }) 
    },
    computed: {  
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
            'messages',
            'setMessages',
            'setTwitMessage',
            'setParticipants',      //참석자 셋팅 
            'setUserMessage',       //나의 메시지 객체
            'setChatBotMessage',    //챗봇 메시지 객체
            'setTwitMessage',       //트위터 메시지 객체
            'setPictureMessage'     //사진DB 메시지 객체
        ]),
        fileupload(e){ 
            const formData = new FormData();
            formData.append('file',this.$refs.file.files[0]); 
            try{
                axios.post('http://localhost:3000/upload', formData);
                //axios.post('https://fc02ebac.ngrok.io/upload', formData);  //외부 접속        
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
                //나의 메시지 전송
                this.setUserMessage(inputText); 
                
                this.$store.state.typostate = null;
                this.textInput = null;
                this.socket.emit("typo", {
                    data: this.$store.state.typostate        
                });
                //서버로 전송
                this.socket.emit("chat-message", {
                    message: inputText  
                }); 
                
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