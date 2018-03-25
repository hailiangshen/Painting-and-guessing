<template>
    <div>
        <room-head></room-head>
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
import roomHead from 'src/components/room-head/component';

export default {
    data: function() {
        return {
            nickName: "小明",
            startBtns: [
                {
                    name: '起飞',
                    onClick: function() {
                        this.$router.push({
                            path: '/painting'
                        });
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
            btn && btn.onClick && btn.onClick.call(this);
        }
    },
    components: {
        iButton,
        roomHead
    }
};
</script>

<style module>
.userBox{
    margin-top: 10px;
    padding: 50px 0 10px 0;
    background-color: rgb(48,205,154);
    background-size: 40px 40px;
    background-image: linear-gradient(45deg,rgb(80,212,169) 25%, transparent 0, transparent 50%, rgb(80,212,169) 0,rgb(80,212,169) 75%, transparent 0);
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