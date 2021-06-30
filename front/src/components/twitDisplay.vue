<template>
<div class="h-full">
    <div class="items-center flex bg-white rounded-lg rounded-rg p-4 h-auto w-full">
        <!-- 프로필사진 -->
        <img class="item h-16 rounded-full mr-5 flex-none" :src="imagedata.profile_image">
        <!-- 프로필설명 -->
        <div class="h-auto flex-shrink">
            <div class="justify-self-center text-lg">{{imagedata.username}}</div>
            <div class="justify-self-center text-pink-500 text-xs">{{imagedata.description}}</div>
            <div class="justify-self-center text-gray-600 text-xs">{{imagedata.created_at}}</div>
        </div>
        <!-- <img class="h-8 rounded-full mr-6 flex-none" src="http://www.safetimes.co.kr/news/photo/201807/67728_39320_4953.jpg"> -->
    </div>
   <div class="h-auto w-full p-4 bg-red-300">
        <p class="text-lg">{{imagedata.content}}</p>
        <a v-if="imagedata.media_url == ''" class="text-lg" :href="imagedata.url">{{imagedata.url}}</a>
        <img v-else class="h-auto w-full mb-4 flex-none" :src="imagedata.media_url">
   </div>  
 </div>
</template>
<script>

    export default { 
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
   .item{   
        -webkit-box-shadow:  0 2px 20px 2px rgba(90, 90, 90, 0.47);
        box-shadow: 0 2px 20px 2px rgba(90, 90, 90, 0.47); 
    }
</style>
