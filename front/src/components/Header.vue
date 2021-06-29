<template>
    <div class="header-container md:max-w-full flex">
        
        <div class="container-menu inline-flex" @click.prevent="userlist">
           <v-icon class="w-2/4" name="menu" :style="{color: 'white'}"></v-icon>  
        </div>
            
        <div class="header-title italic flex-1 text-5xl">
            <p class="title" :style="{color: 'white'}">IDOL CHAT BOT</p>
        </div>
    </div>
</template>
<script>

    export default {
        computed: {
        
        },
        methods: {
            userlist() {
               //console.log("test",this.$store.state.fade);
              
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
        border-top-right-radius: 5rem;
        background-image: linear-gradient(to right, #FF5FA2, #FCC89B);
        align-items: center;
        -webkit-box-shadow:  0 2px 20px 2px rgba(90, 90, 90, 0.47);
        box-shadow: 0 2px 20px 2px rgba(90, 90, 90, 0.47); 
    }
   
  

  

</style>
