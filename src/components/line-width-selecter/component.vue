
<template>
<div>
    <div :class="$style.current" v-on:click="toggle(true)">
        <span :style="{'background-color': color, 'height': currentWidth + 'px'}"></span>
    </div>
    <div :class="[$style.mask, active && $style.active]" v-show="active" v-on:click="toggle(false)"></div>
    <div :class="[commonStyles.clearFix, $style.box, active && $style.active]">
        <div v-for="item in widthArray" :class="$style.item" v-on:click="selecte(item)">
            <span :style="{'background-color': color, 'height': item + 'px'}"></span>
        </div>
    </div>
</div>
</template>

<script>
import commonStyles from "src/share/style";
export default {
    props: {        
        color: {
            type: String,
            default: '#AE00AE'
        },
        // 如不传则会默认数组中第一个并触发一次改变事件
        width: {
            type: Number
        },
        widthArray: {
            type: Array,
            default: function() {
                return [2, 3, 5, 7, 10];
            }
        }
    },
    data: function() {
        return {
            commonStyles,
            active: false,
            currentWidth: 1
        };
    },
    computed: {},
    methods: {
        toggle: function(active = null) {
            this.active = active === null ? !this.active : active;
        },
        selecte: function(width) {
            this.currentWidth = width;
            this.$emit("changed", width);
            this.toggle(false);
        }
    },
    mounted: function() {
        if(this.width){
            this.currentWidth = this.width;
        } else {
            this.selecte(this.widthArray[0]);
        }
    },
    components: {}
};
</script>

<style module>
.current {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 1.5rem;
    margin: 0 auto;
}
.current > span{
    display: block;
    width: 100%;
    height: 4px;
    border-radius: 3px;
}
.mask{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    transition: all .2s ease-out;
    background-color: rgba(0,0,0,0);
}
.mask.active{
    background-color: rgba(0,0,0,.2);
}
.box {
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
.item {
    float: left;
    width: 8vw;
    height: 8vw;
    border-radius: 100%;
    margin: 10px;
}
.item > span{
    display: block;
    width: 100%;
    height: 4px;
    border-radius: 3px;
}
.box.active{
    transform: translateY(0);
}
</style>
