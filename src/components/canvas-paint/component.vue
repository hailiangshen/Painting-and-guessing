
<template>
<canvas ref="canvasPainter" :width="width" :height="height" v-on:touchstart="preDraw" v-on:touchmove="draw" v-on:touchend="afterDraw">
    <p>你的浏览器不支持</p>
</canvas>
</template>

<script>
export default {
    props: {
        width: {
            type: Number
        },
        height: {
            type: Number
        },
        color: {
            type: String,
            required: true
        },
        lineWidth: {
            type: Number,
            default: 1
        }
    },
    data: function() {
        return {
            // context: null
        };
    },
    computed: {},
    methods: {
        clear: function() {
            this.context &&
                this.context.clearRect(0, 0, this.width, this.height);
        },
        preDraw: function(e) {
            Array.prototype.forEach.call(e.touches, touch => {
                this.touchesData[touch.identifier] = {
                    startPosition: {
                        x: touch.pageX - e.target.offsetLeft,
                        y: touch.pageY - e.target.offsetTop
                    }
                };
            });
            e.preventDefault();
        },
        draw: function(e) {
            // if (!event.targetTouches || !event.targetTouches.length === 1) {
            //     return;
            // }
            Array.prototype.forEach.call(e.touches, touch => {
                let startPostion = this.touchesData[touch.identifier]
                        .startPosition,
                    currentPosition = {
                        x: touch.pageX - e.target.offsetLeft,
                        y: touch.pageY - e.target.offsetTop
                    };
                // drawCurvePath(this.context, startPostion, currentPosition, .3);
                this.context.beginPath();
                this.context.moveTo(startPostion.x, startPostion.y);
                this.context.lineTo(currentPosition.x, currentPosition.y);
                this.context.stroke();                
                this.context.closePath();

                this.touchesData[touch.identifier].startPosition = currentPosition;
            });
        },
        afterDraw: function(e) {
            // 移除结束touch的touchesData缓存
            Array.prototype.forEach.call(e.changedTouches, touch => {
                delete this.touchesData[touch.identifier];
            });
        }
    },
    created: function() {
        this.touchesData = {};
    },
    mounted: function() {
        if (!this.$refs.canvasPainter || !this.$refs.canvasPainter.getContext) {
            console.error("canvas not supported!");
        } else {
            this.context = this.$refs.canvasPainter.getContext("2d"); //'webgl'
            this.context.lineCap="round";
        }
    },
    watch: {
        color: function() {
            this.context && (this.context.strokeStyle = this.color);
        },
        lineWidth: function() {
            this.context && (this.context.lineWidth = this.lineWidth);
        }
    },
    components: {}
};
</script>

<style module>

</style>
