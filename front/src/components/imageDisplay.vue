<template>
<vueper-slides fractions fade slide-content-outside="top" slide-content-outside-class="max-widthed" fixed-height="500px" :slide-ratio="0.3" >
  <vueper-slide class="chage" v-for="(slide, i) in this.imagedata.content" :key="i" :title="'# ' + i.toString()" :image="slide"></vueper-slide>
</vueper-slides>
</template>
<script>
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';

    export default {
		name: 'image',
		components: { VueperSlides, VueperSlide },
        props: {
            imagedata: {
                required: true
            },
		},
		created(){
			//console.log("test",this.imagedata.content);
 		},
		data(){
			return {
			
			}
    	}, 
    }
</script>


<style scoped>
.chage{
	background-size:contain;
	background-repeat:no-repeat;
}
</style>
