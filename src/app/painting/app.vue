
<template>
<div v-if="currentRoom">
    <room-head :title="currentRoom.name"></room-head>
    <div :class="$style.painterContainer">
        <canvas-paint :width="painterConfigs.width" :height="painterConfigs.height" :color="painterConfigs.color" :line-width="painterConfigs.lineWidth" ref="painter"></canvas-paint>
    </div>
    <div :class="[commonStyles.clearFix, $style.operationPanel]">
        <div :class="[$style.operationBtn, $style.btnColor]" :style="btnColorStyle">
            <colorSelecter v-on:colorChanged="colorChanged"></colorSelecter>
        </div>
        <div :class="[$style.operationBtn, $style.btnLineWidth]">
            <line-width-selecter  v-on:changed="widthChanged"></line-width-selecter>
        </div>
        <div :class="[$style.operationBtn, $style.btnColor]"></div>
        <div :class="[$style.operationBtn, $style.btnColor]"></div>
        <div :class="[$style.operationBtn, $style.btnClear]" v-on:click="clear"></div>
    </div>
    <router-link to="/">painting!</router-link>
</div>
</template>

<script>
import roomHead from "src/components/room-head/component";
import colorSelecter from "src/components/color-selecter/component";
import canvasPaint from "src/components/canvas-paint/component";
import lineWidthSelecter from "src/components/line-width-selecter/component";
import commonStyles from 'src/share/style';

export default {
    beforeRouteEnter: (to, from, next) => {
        // ...
        next();
    },
    data: function() {
        return {
            commonStyles,
            painterConfigs: {
                color: '',
                width: 0,
                height: 0,
                lineWidth: 1
            } 
        };
    },
    computed: {
        currentRoom: function() {
            return this.$store.state.currentRoom;
        },
        btnColorStyle: function() {
            return {
                color: this.painterConfigs.color
            };
        }
    },
    methods: {
        colorChanged: function(color) {
            this.painterConfigs.color = color;
        },
        widthChanged: function(width) {
            this.painterConfigs.lineWidth = width;
        },
        clear: function() {
            if(confirm('清空画布?')) {
                this.$refs.painter.clear();
            }
        }
    },
    mounted: function() {
        this.painterConfigs.width = document.body.clientWidth;
        this.painterConfigs.height = document.body.clientHeight;
    },
    components: {
        roomHead,
        colorSelecter,
        canvasPaint,
        lineWidthSelecter
    }
};
</script>

<style module>
.painterContainer {
    width: 100vw;
    height: 100vw;
    background-color: rgb(245, 245, 245);
}
.operationPanel{
    width: 100vw;
    height: 2rem;
    margin-top: 10px;
    padding: 5px;
    background-color: rgb(245, 245, 245);    
}
.operationBtn{
    float: left;
    width: 17vw;
    height: 100%;
    margin: 0 1vw;
}
.btnColor{
    border-radius: 1rem;    
}
.btnClear{
    background: url(./clear.png) no-repeat 50%;
}
</style>
