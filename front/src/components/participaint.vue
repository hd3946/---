<template>
    <div class="sidebar-slot">
        <p class="header-paticipants-text text-5xl">대화상대</p>

    <div v-if="modal" class="animated fadeIn z-50 pin overflow-auto w-full">
      <div class="flex animated fadeInUp fixed shadow-inner max-w-md md:relative pin-b pin-x align-top m-auto justify-end md:justify-center p-8 md:rounded w-full md:h-auto md:shadow">   
        <div class="flex-auto">
            <label class="block text-gray-700 text-5xl font-bold mb-2" for="username">
                이름변경
            </label>
            <input v-model="nameInput" class="text-5xl shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
        </div>
        <div class="flex-auto">
            <span @click="chagename" class="pin-t pin-r pt-4 px-4">
            <svg class="h-12 w-12 text-grey hover:text-grey-darkest" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
        </div>
      </div>
    </div>
            <span class="paticipants-List" v-for="(participant, index) in getparticipants" :key="participant.id" >
                <div class="flex text-5xl flex-auto p-6 text-black-700" v-if="index > 1">
                        {{ participant.name }}                     
                </div>            
            </span>
            <div class="text-3xl p-6 text-grey-700">
                 {{ gettypo }}
            </div>
            <div class="flex-auto text-4xl p-6">
                        <button @click="chagename() " class="bg-transparent hover:bg-red-500 text-grey-700 font-semibold hover:text-black py-2 px-4 border border-red-500 hover:border-transparent rounded">
                            이름변경
                        </button>
            </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import io from 'socket.io-client';
export default {
name: "participants",
data(){
        return {
            socket:this.$store.state.socket,
            modal: false,
            nameInput: '',
            typo:''
        }
    },
computed: {
    ...mapGetters([
            'getparticipants',
            'gettypo',
        ]),
    },
methods: {
    chagename(){
        this.modal = !this.modal

        if((this.nameInput != null) && (this.texting != 0)){     
            //console.log("?",this.nameInput);
            this.$store.state.curr_user = this.nameInput;
            this.socket.emit("changename", {
                data: this.nameInput           //서버로 전송
            });
             this.nameInput = null;
             this.texting = 0;   
        }
        if(this.nameInput == null){
                this.texting = -1;
        }      
        
    }
    
}
}
</script>

<style>
 .header-paticipants-text{
    /* background: yellow; */
    background-image: linear-gradient(to right, #FF5FA2, #FCC89B);
    height: 8%;
    padding: 10px;
    color: white;
    align-items: center;
    text-align:center;
    margin-top: 0px;
 }
 .paticipants-List{
    text-align:left;
    margin-left:10px;
 }
</style>