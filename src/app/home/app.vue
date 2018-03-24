<template>
    <div>
        <div :class="[$style.topBar, $style.container]">
            <div :class="$style.grid">aaa</div>
            <div :class="$style.grid">你画我猜</div>
            <div :class="$style.grid">bbb</div>
        </div>
        <div :class="$style.userBox">
            <img :src="profilePicture" :class="$style.profilePicture" title="Profile Picture">
            <div :class="$style.nickName">{{nickName}}</div>
        </div>
        <div>
            <i-button :buttons="startBtns" v-on:click="startClick"></i-button>
        </div>
    </div>
</template>

<script>
import { TextToImageUrl } from 'src/libs/common.js';
import iButton from 'src/components/i-button/component';

export default {
    data: function() {
        return {
            nickName: "小明",
            startBtns: [
                {
                    name: '起飞',
                    onClick: function() {
                        alert('飞！');
                    }
                }
            ]
        };
    },
    computed: {
        profilePicture: function() {
            return TextToImageUrl(this.nickName);
        }
    },
    methods: {
        startClick: function(btn) {
            btn && btn.onClick && btn.onClick();
        }
    },
    components: {
        iButton
    }
};
</script>

<style module>
.topBar {
    height: 1.5rem;
    font-size: 0.8rem;
    color: #fff;
    font-weight: 100;
    background-color: rgb(53, 129, 255);
}
.container {
    display: grid;
    grid-template-columns: 0.33fr 0.34fr 0.33fr;
}
.grid {
    line-height: 1.5rem;
}
.userBox{
    padding: 50px 0 10px 0;
    /* background-size: 40px 40px;
    background-image: linear-gradient(45deg,#ffbb3346 50%, transparent 0); */
    
}
.profilePicture{
    width: 4rem;
    height: 4rem;
    border-radius: 4rem;
}
.nickName{
    padding: 10px;
    font-size: 1.2em;
}
</style>