<template>
  <div class="md:container md:mx-auto">
    <div>
      <span class="md:decoration-slice">
        Hello World
      </span>
    </div>
    <div class="float-left h-full w-4/6">
      <ViewImage />
    </div>
    <div
      v-if="this.$store.state.login == true"
      class="float-right w-2/6 h-screen p-6"
    >
      <div v-if="this.$store.state.fade" id="sidebar">
        <Participant />
      </div>
      <div calss="w-full">
        <Chat :colors="colors"> </Chat>
      </div>
    </div>
    <div v-else class="float-right w-2/6 h-screen p-6"><login /></div>
  </div>
</template>

<script>
import Chat from "./components/Chat.vue";
import login from "./components/Login";
import Participant from "./components/LoginParticipaint";
import ViewImage from "./components/ViewImage.vue";

export default {
  name: "app",
  components: {
    Chat,
    login,
    Participant,
    ViewImage,
  },
  data() {
    return {
      colors: {
        message: {
          myself: {
            bg: "#fff",
            text: "#bdb8b8",
          },
          others: {
            bg: "#fb4141",
            text: "#fff",
          },
          messagesDisplay: {
            bg: "#f7f3f3",
          },
        },
      },
    };
  },
  methods: {
    isSupportNotification() {
      return process.browser && window && "Notification" in window;
    },

    getNotificationPermission() {
      if (!this.isSupportNotification()) {
        this.isAllowNotification = false;
        return Promise.reject(new Error("not_supported"));
      }

      if (Notification.permission === "granted") {
        var notification = new Notification("Hi there!");
        this.isAllowNotification = true;
        return Promise.resolve();
      } else if (
        Notification.permission !== "denied" ||
        Notification.permission === "default"
      ) {
        return Notification.requestPermission().then((result) => {
          if (result === "granted") {
            this.isAllowNotification = true;
          }
        });
      }
    },

    //나중에 위치 전송
    createForegroundNotification(title, { body }) {
      const notification = new Notification(title, {
        body,
      });

      notification.onshow = () => {
        setTimeout(() => notification.close(), 5000);
      };
      notification.onerror = (e) => {
        console.error(e);
      };
    },
    getGeo() {
      if (!this.isSupportNotification()) {
        return;
      }
      this.getNotificationPermission();
      if (!this.isAllowNotification) {
        return;
      }
      console.log("실행");
      if (Notification.permission !== "granted") {
        alert("notification is disabled");
      } else {
        var notification = new Notification("Notification title", {
          body: "Notification text",
        });

        notification.onclick = function() {
          window.open("http://google.com");
        };
      }
      this.createForegroundNotification("님이 메세지를 보냈어요.", {
        body: "보내지는건가",
      });
    },
  },
};
</script>

<style>
#sidebar {
  position: absolute;
  top: 10%;
  left: 72%;
  width: 25%;
  background: #fcfafa;
}
</style>
