<template>
  <div class="bg justify-around flex-wrap" :style="{background: colors.message.messagesDisplay.bg}">
    <!-- <p>사진, 움짤 ,영상 ,노래</p> -->
    <button id="button" class="h-full w-16 text-sm text-white font-bold rounded-full bg-Pink-500 hover:bg-Pink-700" type="button" @click.prevent="enter">트위터</button>
    <button id="button" class="h-full w-16 text-sm text-white font-bold rounded-full bg-Pink-500 hover:bg-Pink-700" type="button" @click.prevent="enter">사진</button>
    <button id="button" class="h-full w-16 text-sm text-white font-bold rounded-full bg-Pink-500 hover:bg-Pink-700" type="button" @click.prevent="enter">움짤</button>
    <button id="button" class="h-full w-16 text-sm text-white font-bold rounded-full bg-Pink-500 hover:bg-Pink-700" type="button" @click.prevent="enter">영상</button>
    <button id="button" class="h-full w-16 text-sm text-white font-bold rounded-full bg-Pink-500 hover:bg-Pink-700" type="button" @click.prevent="enter">노래</button>
  </div>
</template>

<script>
export default {
    data() {
        return {
            key: value
        }
    },
    props:{
        colors: {
            type: Object,
            required: true
        },
    },
};
</script>

<style scoped> 
.bg{
    display: flex;
}
</style>
