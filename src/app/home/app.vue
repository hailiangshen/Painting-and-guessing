<template>
    <div>
        <room-head></room-head>
        <div :class="$style.userBox">
            <img v-show="profilePicture" :src="profilePicture" :class="$style.profilePicture" title="Profile Picture">
            <div :class="$style.nickName">{{nickName}}</div>
        </div>
        <div :class="$style.currentRoom" v-if="currentRoom">
            <div :class="[commonStyles.clearFix, $style.room]">
                <span :class="[$style.roomLab, commonStyles.fl]">{{currentRoom.name}}</span>
                <span :class="[$style.roomLab, commonStyles.fr]">{{currentRoom.users.length}}只瓜娃子</span>
            </div>
            <div :class="[$style.roomUsers]">
                <div :class="[$style.user, (user.id === currentUser.id) && $style.isMe]" v-for="user in currentRoom.users">{{user.nickName}}</div>
            </div>
            <i-button :buttons="startBtns" v-on:click="startClick"></i-button>
        </div>
        <div :class="$style.roomList" v-if="!currentRoom">
            <div v-for="(room, index) in roomList" :key="index" v-on:click="selectRoom(room)" :class="[commonStyles.clearFix, $style.room]">
                <span :class="[$style.roomLab, commonStyles.fl]">{{room.name}}({{room.users.length}}只瓜娃子)</span>
                <span :class="[$style.roomLab, commonStyles.fr]">赶紧加入</span>
            </div>
        </div>
        <div>
        </div>
    </div>
</template>

<script>
import { TextToImageUrl } from 'src/libs/common.js';
import iButton from 'src/components/i-button/component';
import roomHead from 'src/components/room-head/component';
import commonStyles from 'src/share/style';

export default {
    data: function() {
        return {
            commonStyles,
            startBtns: [
                {
                    name: '看什么看，赶紧起飞！',
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
        currentRoom: function() {
            return this.$store.state.currentRoom;
        },
        currentUser: function() {
            return this.$store.state.currentUser || {};
        },
        nickName: function() {
            return this.currentUser.nickName;
        },
        profilePicture: function() {
            return TextToImageUrl(this.nickName);
        },
        roomList: function() {
            return this.$store.state.rooms;
        }
    },
    methods: {
        startClick: function(btn) {
            btn && btn.onClick && btn.onClick.call(this);
        },
        selectRoom: function(room) {
            this.$socket.enterRoom(room);
            this.$store.commit('setRoom', room);
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
.room{
    background-color: rgb(2, 120, 215);
    width: 100%;
    padding: 0 10px;
}
.roomLab{
    height: 2rem;
    font-size: 1.2em;
    line-height: 2rem;
    color: #fff;
}
.currentRoom{
    margin-top: 10px;
}
.roomList{
    margin-top: 10px;
}
.roomUsers{
    padding: 5px 15px;
}
.user{
    text-align: left;
    margin: 5px 0;
}
.isMe{
    background-color: rgb(48,205,154);
    background-size: 40px 40px;
    background-image: linear-gradient(45deg,rgb(80,212,169) 25%, transparent 0, transparent 50%, rgb(80,212,169) 0,rgb(80,212,169) 75%, transparent 0);
}
</style>