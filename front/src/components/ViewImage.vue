<template>
  <div class="grid grid-cols-1 md:grid-cols-3 ">
    <div v-for="image in images" :key="image.id">
      <img
        :src="chageEncoding(image)"
        @error="setAltImg"
      />
      <!-- <img src="/image/imagetest.gif" /> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      iphost: this.$store.state.host,
      images: [],
    };
  },
  created() {
    this.callImage;
  },
  computed: {
      ...mapGetters([
      "chageEncoding", 
      'setAltImg',
    ]),  
    async callImage() {
      try {
        const response = await axios.get(this.iphost + "/imageshow");
        this.images = response.data;
        console.log(this.images);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped></style>
