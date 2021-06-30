<template>
  <div ref="trancelogin" class="w-full h-full login">

    <div class="relative p-4">
       <img src="/image/logo.png"/>
    </div> 

    <div ref="trancerow" class="relative p-4 h-32 my-10 w-full"> 
      <svg version="1.1" class="h-28 w-1/6 p-4 user-icon inline-block"
      viewBox="-255 347 100 100" xml:space="preserve" >
        <path class="user-path" d="
        M-203.7,350.3c-6.8,0-12.4,6.2-12.4,13.8c0,4.5,2.4,8.6,5.4,11.1c0,0,2.2,1.6,1.9,3.7c-0.2,1.3-1.7,2.8-2.4,2.8c-0.7,0-6.2,0-6.2,0
        c-6.8,0-12.3,5.6-12.3,12.3v2.9v14.6c0,0.8,0.7,1.5,1.5,1.5h10.5h1h13.1h13.1h1h10.6c0.8,0,1.5-0.7,1.5-1.5v-14.6v-2.9
        c0-6.8-5.6-12.3-12.3-12.3c0,0-5.5,0-6.2,0c-0.8,0-2.3-1.6-2.4-2.8c-0.4-2.1,1.9-3.7,1.9-3.7c2.9-2.5,5.4-6.5,5.4-11.1
        C-191.3,356.5-196.9,350.3-203.7,350.3L-203.7,350.3z"/>
      </svg>
      <input  class="w-9/12 inline-block focus:outline-none focus:shadow-outline rounded-lg border-b border-teal-500" type="text" v-model="textInput" id="username_input"  placeholder="Username"/>
    </div>

    <div class="absolute p-4 w-full h-24 bottom-0">
      <button id="button" class="w-full h-full text-lg md:text-3xl text-white font-bold rounded-full bg-Pink-500 hover:bg-Pink-700" type="button" @keyup.enter="enter" @click.prevent="enter">Log In</button>
    </div>   
</div>
</template>

<script>
import Velocity from 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { mapMutations , mapGetters } from 'vuex'

export default {
  name: "login",
  data() {
    return {
      socket:this.$store.state.socket,
      message: 'Hello World',
      textInput: '',
      newmsg:[],
      id : [],
      name : [],
      participants:[],
    };
  },
  created(){
    
  },

  mounted(){
    let divs = this.$refs.trancelogin;
    Velocity(divs,"transition.slideUpIn",{duration: 1200});
    let rows = this.$refs.trancerow;
    Velocity(rows,"transition.slideLeftIn",{stagger: 500});
  },
  methods: {
     ...mapMutations([
            'setParticipants',
            'setMessages',
            'setPlaceholder',
            'setChatTitle',
             'newMessage',
        ]),
    enter(el, done) {
      let divs = this.$refs.trancerow;
      if((this.textInput == '') && (this.textInput.length == 0)){
         Velocity(divs,"callout.shake");
      }
      else{
        this.socket.emit("newUser", {
            data: this.textInput           //서버로 전송
        });
        this.$store.state.curr_user = this.textInput;
        this.$store.state.login = true;
      }
    },
  }
};
</script>

<style scoped>
*, *:before, *:after {
  box-sizing: border-box;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}

.login { 
  border-bottom-left-radius:10px;
  border-bottom-right-radius:10px;
  border-top-left-radius:10px;
  border-top-right-radius:10px;
  background-image: linear-gradient(to bottom, rgb(70, 62, 65), rgb(187, 137, 104));
}

.password-icon .key-path,
.user-icon .user-path{
  fill: rgba(10,10,10,0);
  stroke: #fff;
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-miterlimit: 10;
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  -webkit-animation: dash 3s .3s linear forwards;
  animation: dash 3s .3s linear forwards;
}

.user-icon .user-path {
  -webkit-animation: dash 3s .8s linear forwards;
  animation: dash 3s .8s linear forwards;
}

input {
  background: transparent;
}

input:focus,
button:focus {
  outline: none;
}

input::-webkit-input-placeholder {
  color: rgba(255,255,255,.4);
}

input::-moz-placeholder {
  color: rgba(255,255,255,.4);
}

@-webkit-keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}


</style>