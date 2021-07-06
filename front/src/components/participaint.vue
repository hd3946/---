<template>
    <div class="relative rounded-tl-lg rounded-r-lg h-full">
        <div class="header">
            <p class="text-3xl">대화 상대</p>
        </div>
        <div class="text-lg p-6">
            <button @click="chagename() " class="bg-transparent hover:bg-red-500 text-grey-700 font-semibold hover:text-black py-2 px-4 border border-red-500 hover:border-transparent rounded">
                이름변경
            </button>
        </div>
        <div v-if="modal" class="shadow-inner pin-b pin-x align-top justify-end p-8">   
            <div class="flex">
                <input v-model="nameInput" class="text-lg shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
                <span @click="chagename">
                    <svg class="h-12 w-12 text-grey hover:text-grey-darkest" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>
        </div>
        <div class="paticipants-List" v-for="(participant, index) in getparticipants" :key="participant.id" >
            <div class="flex text-lg p-6 text-black-700" v-if="index > 0">
                {{ participant.name }}                     
            </div>            
        </div> 
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
name: "participants",
data(){
        return {
            socket:this.$store.state.socket,
            modal: false,
            nameInput: ''
        }
    },
computed: {
    ...mapGetters([
            'getparticipants'
        ]),
    },
methods: {
    chagename(){
        this.modal = !this.modal

        if((this.nameInput != null) && (this.texting != 0)){     
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
.header{
    height: 15%;
    text-align: center;
}
.display{
    height: 75%
}
 .paticipants-List{
    text-align:left;
 }
</style>