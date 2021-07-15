<template>
  <div class="container-message-manager w-full flex">
    <div class="container-send-message inline-flex" @click="chooseFiles()">
      <v-icon
        name="upload"
        class="box-border w-12"
        base-class="icon-send-message"
        :style="{ color: 'red' }"
      ></v-icon>
      <input
        type="file"
        id="imageUpload"
        ref="selectFile"
        class="img-button"
        accept="image/*"
        @change="fileUpload($event)"
        hidden
      />
    </div>
    <div class="message-text-box inline-flex w-full flex-1">
      <input
        class="message-input w-full text-1xl"
        :placeholder="placeholder"
        tabIndex="0"
        contenteditable="true"
        v-model="textInput"
        @keyup.enter="sendMessage"
      />
    </div>
    <div class="container-send-message" @click.prevent="sendMessage">
      <v-icon
        name="send"
        class="w-12"
        base-class="icon-send-message"
        :style="{ color: 'red' }"
      ></v-icon>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "MessageInput",
  props: {},
  data() {
    return {
      socket: this.$store.state.socket,
      textInput: "", // 현재 채팅
      iphost: this.$store.state.host, // 서버 ip
      selectFile: null, // 파일 객체
      previewImgUrl: null, // 미리보기 이미지 URL
      isUploading: false, // 파일 업로드 체크
      response: null, // 파일 업로드후 응답값
    };
  },
  created() {
    this.socket.on("typo", (data) => {
      this.$store.state.typostate = data.data;
    });
    //사진 출력
    this.socket.on("searchidol", (db) => {
      this.setPictureMessage(db);
    });
    //트위터
    this.socket.on("twit-message", (data) => {
      this.setTwitMessage(data);
    });
  },
  computed: {
    placeholder: function() {
      return this.$store.state.placeholder;
    },
  },
  watch: {
    //입력중 기능
    textInput() {
      if (this.textInput != null && this.texting != 0) {
        this.$store.state.typostate = this.$store.state.curr_user + "입력중...";
        this.texting = 0;
        //서버로 전송
        this.socket.emit("typo", {
          data: this.$store.state.typostate,
        });
      }
      if (this.textInput == null) {
        this.texting = -1;
      }
    },
  },
  methods: {
    ...mapMutations([
      "messages",
      "setMessages",
      "setTwitMessage",
      "setParticipants", //참석자 셋팅
      "setUserMessage", //나의 메시지 객체
      "setChatBotMessage", //챗봇 메시지 객체
      "setTwitMessage", //트위터 메시지 객체
      "setPictureMessage", //사진DB 메시지 객체
      "fileUploadToSever",
    ]),
    //파일 업로드
    fileUpload() {
      // 선택된 파일이 있는가?
      if (0 < this.$refs.selectFile.files.length) {
        // 0 번째 파일을 가져 온다.
        this.selectFile = this.$refs.selectFile.files[0];
        // 마지막 . 위치를 찾고 + 1 하여 확장자 명을 가져온다.
        let fileExt = this.selectFile.name.substring(
          this.selectFile.name.lastIndexOf(".") + 1,
        );
        // 소문자로 변환
        fileExt = fileExt.toLowerCase();
        // 이미지 확장자 체크, 1메가 바이트 이하 인지 체크 && this.selectFile.size <= 1048576
        if (["jpeg", "png", "gif", "bmp"].includes(fileExt)) {
          // FileReader 를 활용하여 파일을 읽는다
          let reader = new FileReader();
          reader.onload = (e) => {
            // base64
            this.previewImgUrl = e.target.result;
          };
          reader.readAsDataURL(this.selectFile);
        } else if (this.selectFile.size <= 1048576) {
          // 이미지외 파일
          this.previewImgUrl = null;
        } else {
          alert("파일을 다시 선택해 주세요.");
          this.selectFile = null;
          this.previewImgUrl = null;
        }
      } else {
        // 파일을 선택하지 않았을때
        this.selectFile = null;
        this.previewImgUrl = null;
      } 
      this.fileUploadToSever(this.selectFile);
    }, 
    //이미지 클릭 => 파일업로드 함수 실행
    chooseFiles() {
      document.getElementById("imageUpload").click();
    },
    sendMessage() {
      if (this.textInput) {
        let inputLen = this.textInput.length;
        let inputText = this.textInput;
        if (this.textInput[inputLen - 1] == "\n") {
          inputText = inputText.slice(0, inputLen - 1);
        }
        //나의 메시지 전송
        this.setUserMessage(inputText);

        this.$store.state.typostate = null;
        this.textInput = null;
        this.socket.emit("typo", {
          data: this.$store.state.typostate,
        });
        //서버로 전송
        this.socket.emit("chat-message", {
          message: inputText,
        });
      }
    },
  },
};
</script>
<style scoped>
.container-message-manager {
  background: #fff;
  align-items: center;
  -webkit-box-shadow: 0px -2px 40px 0px rgba(186, 186, 186, 0.67);
  box-shadow: 0px -2px 40px 0px rgba(186, 186, 186, 0.67);
}
.message-text-box {
  overflow: hidden;
}
.message-input {
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

.message-input:focus {
  outline: none;
}

.icon-send-message {
  cursor: pointer;
  opacity: 0.7;
  transition: 0.3s;
  border-radius: 11px;
  padding: 8px;
}
.icon-send-message:hover {
  opacity: 1;
  background: #eee;
}
.input {
  vertical-align: middle;
}
</style>
