<template>
    <div class="progress">
        <!--<p>{{ position }}</p>-->
        <div class="progress-bar" @mousemove.stop="getSeeking($event)" @click="setSeeking($event)">
            <!--<div class="fill" :style="{ width: percent }"></div>-->
            <div class="fill"></div>
            <div class="ghost" :style="{ width: seekPercent }"><div class="cursor"></div></div>
        </div>
        <!--<p>{{ duration }}</p>-->
    </div>
</template>

<script>
    export default {
        name: "ProgressBar",
        data() {
            return {
                position: "0:00",
                duration: "3:35",
                percentRaw: 0,
                seekPercentRaw: 0
            }
        },
        computed: {
            percent() {
                return (this.seekPercentRaw*100).toFixed(2) + "%"
            },
            seekPercent() {
                return (this.seekPercentRaw*100).toFixed(2) + "%"
            }
        },
        mounted() {
            // window.clearInterval(window.int)
            // window.int = window.setInterval(() => {
                // this.seekPercentRaw += 0.001
                this.$gsap.to(window.document.getElementsByClassName("fill")[0], 170, {
                    scaleX: 350,
                    ease: "linear"
                })
            // }, 1000)
            
        },
        methods: {
            getSeeking(event) {
                const orig = window.document.getElementsByClassName("progress-bar")[0].getBoundingClientRect().left;
                const offset = event.clientX - orig;
                const width = window.document.getElementsByClassName("progress-bar")[0].clientWidth;
                this.seekPercentRaw = offset / width;
            },
        }
    }
</script>

<style lang="scss" scoped>

.progress {
    height: 20px;
    display: flex;
    align-items: center;
    background-color: #fff;
    p { margin: 0; color: #fff; font-weight: 500; }
    .progress-bar {
        height: 18px;
        position: relative;
        width: 100%;
        border-bottom: 2px dotted #fff;
        background-color: #fff;
        &:hover {
            .ghost { 
                opacity: 1
            } 
        }
        div {
            position: absolute;
            top: 0; left: 0;
            height: calc(100% + 2px);
            max-width: 100%;
            &.fill {
                background: linear-gradient(to right, #72adb1 0%, #0077ca 100%);
                width: 1px;
                transform-origin: left;
            }
            &.ghost {
                background-color: rgba(0, 119, 202, 0.35);
                opacity: 0;
                transition: opacity 0.8s;
                position: relative;
                .cursor {
                    position: absolute;
                    left: 100%;
                    top: 0;
                    width: 2px;
                    height: 100%;
                    opacity: 1;
                    background-color: #fff;
                    z-index: 600;
                }
            }
        }
    }
}
</style>