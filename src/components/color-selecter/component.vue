
<template>
<div>
    <div :class="$style.currentColor" :style="{'background-color': currentColor}" v-on:click="toggleColorBox(true)"></div>
    <div :class="$style.mask" v-show="active" v-on:click="toggleColorBox(false)"></div>
    <div :class="[commonStyles.clearFix, $style.colorBox, active && $style.active]">
        <div v-for="color in colorArray" :class="$style.color" v-on:click="colorClick(color)" :style="{'background-color': color}"></div>
    </div>
</div>
</template>

<script>
import commonStyles from "src/share/style";
export default {
    props: {
        color: {
            type: String
        },
        colorArray: {
            type: Array,
            default: function() {
                return [
                    '#000000',
                    "#DC143C",
                    "#FF1493",
                    "#800080",
                    "#FF00FF",
                    "#0000CD",
                    "#1E90FF",
                    "#008000",
                    "#6B8E23",
                    "#FFFF00",
                    "#DAA520",
                    "#B8860B"
                ];
            }
        }
    },
    data: function() {
        return {
            commonStyles,
            currentColor: '',
            active: false
        };
    },
    computed: {},
    methods: {
        toggleColorBox: function(active = null) {
            this.active = active === null ? !this.active : active;
        },
        colorClick: function(color) {
            this.currentColor = color;
            this.$emit("colorChanged", color);
            this.toggleColorBox(false);
        }
    },
    mounted: function() {
        this.currentColor = this.color || this.colorArray[0];
    },
    components: {}
};
</script>

<style module>
.currentColor {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 1.5rem;
    margin: 0 auto;
    transition: all .2s ease-in-out;
}
.mask{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
.colorBox {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px;
    background-color: rgb(245, 245, 245);
    box-shadow: 0px 2px 10px #000;
    transform: translateY(100%);
    transition: all .2s ease-out;
}
.color {
    float: left;
    width: 8vw;
    height: 8vw;
    border-radius: 100%;
    margin: 10px;
}
.colorBox.active{
    transform: translateY(0);
}
</style>
