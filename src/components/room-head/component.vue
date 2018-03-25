
<template>
<div>
    <div :class="[$style.topBar, $style.container]">
        <div :class="$style.grid">aaa</div>
        <div :class="$style.grid">{{title}}</div>
        <div :class="$style.grid">bbb</div>
    </div>
</div>
</template>

<script>

export default {
    props: {
        title: {
            type: String,
            default: '你画我猜'
        }
    },
    data: function() {
        return {

        }
    },
    computed: {

    },
    methods: {

    },
    components: {
        
    }
}
</script>

<style module>
.topBar {
    height: 1.5rem;
    font-size: 0.8rem;
    color: #fff;
    font-weight: bold;
    /* background-color: rgb(48,205,154); */
    background-image: linear-gradient(rgb(80,212,169) 10%, rgb(48,205,154) 40%, rgb(29, 165, 122) 100%);
}
.container {
    display: grid;
    grid-template-columns: 0.33fr 0.34fr 0.33fr;
}
.grid {
    line-height: 1.5rem;
}
</style>
