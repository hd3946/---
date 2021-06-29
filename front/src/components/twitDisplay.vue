<template>
<div>
    <div class="md:flex bg-white rounded-lg p-6">
        <img class="md:h-auto md:w-32 rounded-full md:mr-6 flex-grow" :src="imagedata.profile_image">
        <div class="md:w-2/4 text-center md:text-left flex-shrink">
            <h2 class="text-4xl">{{imagedata.username}}</h2>
            <div class="text-pink-500 text-lg">{{imagedata.description}}</div>
            <div class="text-gray-600 text-lg">{{imagedata.created_at}}</div>
        </div>
        <img class="md:h-auto md:w-32 rounded-full md:mr-6 flex-grow" src="http://www.safetimes.co.kr/news/photo/201807/67728_39320_4953.jpg">
    </div>
   <div class="p-4 bg-red-300">
        <p class="text-3xl">{{imagedata.content}}</p>
        <a v-if="imagedata.media_url == ''" class="text-3xl" :href="imagedata.url">{{imagedata.url}}</a>
        <img v-else class="block h-auto w-full mx-auto mb-4 " :src="imagedata.media_url">
   </div>  
 </div>
</template>
<script>

    export default {
        //imagedata.content
        name: 'twit',
        props: {
           imagedata: {
                required: true
            },
        },
        computed: {
           
        },
        methods: {
           
        }
    }
</script>

<style scoped>
   
</style>
