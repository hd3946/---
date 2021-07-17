<template>
    <div class="header-container rounded-tl-lg rounded-r-lg flex">
        
        <div class="flex" @click.prevent="userlist">
           <v-icon class="w-12" name="menu" :style="{color: 'white'}"></v-icon>  
        </div>
            
        <div class="block ml-8">
            <p class="w-auto center text-2xl text-white">IDOL CHAT BOT</p>
            <p class="w-auto text-sm font-mono text-black-400 font-light p-1">현재 참가자 {{getparticipantsCount}} 명</p>
            <p class="w-auto text-sm font-mono text-black-400 font-light">{{gettypo}}</p>
        </div>

    </div>
</template>
<script>
import { mapGetters } from 'vuex';

    export default {
        computed: {
            ...mapGetters([
                'getparticipantsCount',
                'gettypo',
            ])
        },
        methods: {
            userlist() {  
               if(this.$store.state.fade == false){
                   this.$store.state.fade = true;
               }else{
                   this.$store.state.fade = false;
               }
               
            },
            
        }
    }
</script>

<style scoped>
    .header-container{ 
        background-image: linear-gradient(to right, #FF5FA2, #FCC89B);
        align-items: center;
        -webkit-box-shadow:  0 2px 20px 2px rgba(90, 90, 90, 0.47);
        box-shadow: 0 2px 20px 2px rgba(90, 90, 90, 0.47); 
    } 

</style>
