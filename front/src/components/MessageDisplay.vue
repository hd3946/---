<template>
    <div ref="containerMessageDisplay" :style="{background: colors.message.messagesDisplay.bg}" class="container-message-display" @scroll="updateScrollState">
        <div v-for="(message, index) in messages" :key="index" class="message-container" :class="{'my-message': getParticipantById(message.participantId).id == 2, 'other-message': getParticipantById(message.participantId).id != 2}">
            <!-- 닉네임 -->
            <p v-if="getParticipantById(message.participantId).id != 2" class="message-username text-sm">
                {{getParticipantById(message.participantId).name}}
            </p>
            <div v-if="message.viewed == 'photo'" class="w-full h-32">
                <imageDisplay :imagedata="message"/>
            </div>
            <!-- 트위터 -->
            <div v-else-if="message.viewed == 'twit'" class="w-full h-auto p-2">
                <twitDisplay :imagedata="message"/>
            </div>
            <!-- 메시지 -->
            <div v-else class="message-text" :style="{background: getParticipantById(message.participantId).id != 2?colors.message.others.bg: colors.message.myself.bg}">
                <p class="text-1xl">{{message.content}}</p>           
            </div>
            <!-- 시간 -->
            <div class="message-timestamp text-xs" :style="{'justify-content': getParticipantById(message.participantId).id != 2?'baseline':'flex-end'}">
                {{ message.timestamp.format('LT') }}
                <v-icon class="w-4 ml-2" name="check" base-class="icon-sent"></v-icon>      
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import twitDisplay from './twitDisplay.vue';
import imageDisplay from './imageDisplay.vue';
export default {
  name: 'MessageDisplay',
  components: {
    twitDisplay,
    imageDisplay
  },
    data(){
        return {
            updateScroll: false,
            lastMessage: null
        }
    },
    props:{
        colors: {
            type: Object,
            required: true
        },
    },
    computed: {
        ...mapGetters([
            'getParticipantById',
            'messages',
            'getparticipants'
        ]),
    },
    created(){

    },
    mounted() {
        this.goToBottom();
    },
    updated(){
        if(this.messages.length && this.messages[this.messages.length-1] !== this.lastMessage || this.updateScroll){
            this.goToBottom();
            this.lastMessage = this.messages[this.messages.length-1]
        }       
    },
    methods:{
        updateScrollState({ target: { scrollTop, clientHeight, scrollHeight }}) {
            if (scrollTop + clientHeight >= scrollHeight) {
                this.updateScroll = true;
            } else {
                this.updateScroll = false;
            }
        },
        goToBottom() {
            let scrollDiv = this.$refs.containerMessageDisplay
            scrollDiv.scrollTop = scrollDiv.scrollHeight
            this.updateScroll = false;
        }
    }
}
</script>

<style scoped>
.container-message-display{
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
}
.message-text{
    background: #fff;
    padding: 6px 10px;
    border-radius: 15px;
    margin: 5px 0 5px 0;
    max-width: 70%;
    overflow-wrap: break-word;
    text-align: left;
    white-space: pre-wrap;
}

.message-text > p {
    margin: 5px 0 5px 0;
    height: 100%;
}

.message-timestamp{ 
    border-radius: 15px; 
    max-width: 50%;
    overflow-wrap: break-word;
    text-align: left;
    color: #bdb8b8;
    width: 100%;
    display: flex;
    align-items: center;
}

.my-message >.message-timestamp{
    text-align: right;
}


.my-message{
    justify-content: flex-end;
    padding-right: 15px;
    align-items: flex-end;
}

.other-message{
    justify-content: flex-start;
    padding-left: 15px;
    align-items: flex-start;
}

.other-message >.message-text{
    color: #fff;
    border-bottom-left-radius: 0px;
}

.my-message >.message-text{
    border-bottom-right-radius: 0px;
}
.message-container{
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
}

.message-username{
    font-weight: bold;
}
.icon-sent{
    color: rgb(129, 127, 127);
}

@keyframes spin{
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>