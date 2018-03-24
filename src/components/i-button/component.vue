<template>
    <div :class="[commonStyles.clearFix, $style.btnBox]">
        <div :class="$style.btn" :style="itemStyles" v-for="(btn, index) in buttons" :key="index" v-on:click.stop="onClick(btn)">{{btn.name}}</div>
    </div>
</template>

<script>
import commonStyles from 'src/share/style.css';
export default {
    props: {
        buttons: {
            type: Array,
            required: true
        }
    },
    data: function() {
        return {
            commonStyles
        }
    },
    computed: {
        itemStyles: function() {
            return {
                width: `${1 / this.buttons.length * 100}%`
            };
        }
    },
    methods: {
        onClick: function(btn) {
            this.$emit('click', btn);
        }
    }
}
</script>

<style module>
.btnBox{
    border: 1px solid #055a8b; 
    color: steelblue;
    font-weight: bold;
}
.btn{
    float: left;
    padding: 5px 10px;
}
.btn:nth-last-child(n+2){
    border-right: 1px solid #055a8b; 
}
</style>


