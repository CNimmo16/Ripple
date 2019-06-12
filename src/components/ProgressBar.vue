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
                seekPercentRaw: 0,
                animation: null
            }
        },
        props: ["index", "isPlaying", "active"],
        watch: {
            durationRaw(newValue) {
                this.slideBar()
            },
            isPlaying(newValue) {
                this.togglePlay(newValue)
            }
        },
        computed: {
            durationRaw() {
                return this.$store.state.duration
            },
            positionRaw() {
                return this.$store.state.position
            },
            percent() {
                return (this.seekPercentRaw*100).toFixed(2) + "%"
            },
            seekPercent() {
                return (this.seekPercentRaw*100).toFixed(2) + "%"
            }
        },
        methods: {
            slideBar() {
                if(this.active) {
                    this.$gsap.killAll();
                    const toIncrease = this.durationRaw - this.positionRaw;
                    const scaleFrom = this.positionRaw / this.durationRaw * 350
                    this.$gsap.fromTo(window.document.getElementsByClassName("fill")[this.index], toIncrease, {css: {scaleX: scaleFrom}}, {css: {scaleX: 350},
                        ease: "linear",
                    })
                }
            },
            togglePlay(play) {
                if(this.active) {
                    if(play) {
                        this.slideBar()
                    } else {
                        this.$gsap.killAll();
                    }
                }
            },
            getSeeking(event) {
                if(this.active) {
                    const rect = window.document.getElementsByClassName("progress-bar")[this.index].getBoundingClientRect()
                    const orig = rect.left;
                    const offset = event.clientX - orig;
                    const width = rect.width;
                    this.seekPercentRaw = offset / width;
                }
            }
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