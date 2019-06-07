<template>
    <!--<div class="player" id="player-view">-->
    <div class="player-view" @mousemove="getCurrPosition($event)">
        <div class="player">
            <TrackCard v-for="(track, index) in tracks" :track="track" :key="index" :position="currPosition[index]" :current="current" :trackChanging="trackChanging" @grow="grow(index)" @shrink="shrink(index)" @skip-to="skipTo(index)" />
        </div>
        <!--<div class="line">|</div>-->
    </div>
</template>

<script>
import { throttle } from "throttle-debounce";

import TrackCard from "@/components/TrackCard.vue"

export default {
    name: 'PlayerView',
    components: {
        TrackCard
    },
    mounted() {
        this.$nextTick(function() {
            window.addEventListener('resize', () => {
                this.getCurrPosition();
            });
        })
        this.getCurrPosition();
    },
    data() {
        return {
            currPosition: [
                { rotateY: -23, translateZ: 1000 },
                { rotateY: -17, translateZ: 1100 },
                { rotateY: -8, translateZ: 1200 },
                { rotateY: 0, translateZ: 1300 },
                { rotateY: 7, translateZ: 1300 },
                { rotateY: 7, translateZ: 1300 },
                { rotateY: 7, translateZ: 1300 },
                { rotateY: 7, translateZ: 1300 },
            ],
            hovered: null,
            trackChanging: false,
            positions: {
                mouseLeft: [
                    // vanishing
                    { rotateY: -20, translateZ: 1680, translateX: -60.9, scale: 0.76, opacity: 0.45 },
                    // previous tracks
                    { rotateY: -15, translateZ: 1760, translateX: -45.9, scale: 0.83, opacity: 0.25 },
                    { rotateY: -9, translateZ: 1840, translateX: -31.1, scale: 0.93, opacity: 0.15 },
                    { rotateY: -4, translateZ: 1920, translateX: -11.7, scale: 0.97, opacity: 0.07 },
                    // current track
                    { rotateY: 0, translateZ: 2000, translateX: 7.4, scale: 1, opacity: 0  },
                    // next tracks
                    { rotateY: 7, translateZ: 1800, translateX: 30.4, translateY: 0, scale: 0.81, opacity: 0.17  },
                    { rotateY: 7, translateZ: 1600, translateX: 45.3, translateY: -25.2, scale: 0.8, opacity: 0.4  },
                    { rotateY: 7, translateZ: 1400, translateX: 54.5, translateY: 13.1, scale: 0.79, opacity: 0.66  },
                    { rotateY: 7, translateZ: 1200, translateX: 70.8, translateY: -8.8, scale: 0.77, opacity: 0.8  },
                    // vanishing
                    { rotateY: 7, translateZ: 1100, translateX: 85.9, scale: 0.76, opacity: 0.9 },
                ],
                mouseRight: [
                    // vanishing
                    { rotateY: -20, translateZ: 1200, translateX: -60.9, scale: 0.76, opacity: 0.45 },
                    // previous tracks
                    { rotateY: -37, translateZ: 1400, translateX: -55, scale: 0.75, opacity: 0.66 },
                    { rotateY: -25, translateZ: 1600, translateX: -43.7, scale: 0.82, opacity: 0.4 },
                    { rotateY: -13, translateZ: 1800, translateX: -28.2, scale: 0.93, opacity: 0.17 },
                    // current track
                    { rotateY: 0, translateZ: 2000, translateX: -9.2, scale: 1, opacity: 0 },
                    // next tracks
                    { rotateY: 3, translateZ: 1920, translateX: 13.5, translateY: 0, scale: 0.9, opacity: 0.17 },
                    { rotateY: 2, translateZ: 1840, translateX: 35.8, translateY: -25.2, scale: 0.8, opacity: 0.07  },
                    { rotateY: 2, translateZ: 1760, translateX: 36.5, translateY: 19.7, scale: 0.73, opacity: 0.07  },
                    { rotateY: 1, translateZ: 1680, translateX: 58.1, translateY: 2.2, scale: 0.72, opacity: 0.07  },
                    // vanishing
                    { rotateY: 1, translateZ: 1600, translateX: 70, scale: 0.7, opacity: 0.2 },
                ]
            },
            current: 3,
            tracks: [
                {
                    cover: require("@/assets/cover-art/skepta.jpg"),
                    artists: ["Skepta"],
                    title: "Bullet From A Gun",
                    type: "album",
                    album: "Ignorance is Bliss"
                },
                {
                    cover: require("@/assets/cover-art/logique.jpg"),
                    artists: ["-M-"],
                    // title: "Logique est ton écho",
                    title: "Logique écho",
                    type: "album",
                    album: "Lettre infinie"
                },
                {
                    cover: require("@/assets/cover-art/dont@me.jpg"),
                    artists: ["Jay Critch"],
                    title: "Don't @ Me",
                    type: "single",
                    album: "Don't @ Me"
                },
                // current track
                {
                    cover: require("@/assets/cover-art/skepta.jpg"),
                    artists: ["Skepta", "Nafe Smallz"],
                    title: "Greaze Mode",
                    type: "album",
                    album: "Ignorance is Bliss"
                },
                
                // next tracks
                {
                    cover: require("@/assets/cover-art/damn.jpeg"),
                    artists: ["Kendrick Lamar", "Rihanna"],
                    title: "LOYALTY. FEAT. RIHANNA.",
                    type: "album",
                    album: "DAMN."
                },
                {
                    cover: require("@/assets/cover-art/leaveme.png"),
                    artists: ["Flipp Dinero"],
                    title: "Leave Me Alone",
                    type: "single",
                    album: "Leave Me Alone"
                },
                {
                    cover: require("@/assets/cover-art/section80.jpg"),
                    artists: ["Kendrick Lamar"],
                    title: "Poe Mans Dreams (His Vice)",
                    type: "album",
                    album: "Section.80"
                },
                
                {
                    cover: require("@/assets/cover-art/logique.jpg"),
                    artists: ["-M-"],
                    title: "Superchérie",
                    type: "album",
                    album: "Lettre infinie"
                },
            ]
        }
    },
    methods: {
        grow(key) {
            // never grow current track
            if(key !== this.current) {
                this.hovered = key
            }
            this.getCurrPosition(null, true);
        },
        shrink() {
            this.hovered = null;
            this.getCurrPosition();
        },
        skipTo(key) {
            if(key !== this.current) {
                this.current = key
                
                this.trackChanging = true;
                this.getCurrPosition()
                window.setTimeout(() => {
                    this.trackChanging = false;
                }, 500)
            }
        },
        getCurrPosition: throttle(100, function(event, hover) {
            const bounds = window.document.getElementsByClassName("player-view")[0].getBoundingClientRect()
            const leftness = event ? (event.clientX - bounds.x) / bounds.width : 0.5;

            let toSet = []
            
            let startFrom = 4 - this.current
            if(startFrom < 0) { startFrom = 0 }
            
            
            
            for(let i=startFrom; i<this.positions.mouseLeft.length; i++) {
                // const params = ["translateZ", "rotateY", "scale"]
                let toPush = {};
                for (const [key] of Object.entries(this.positions.mouseLeft[i])) {
                    const a = this.positions.mouseLeft[i][key];
                    const b = this.positions.mouseRight[i][key];
                    toPush[key] = a + ((b-a) * leftness)
                }
                toSet.push(toPush)
            }
            if(typeof this.hovered === "number" && this.trackChanging === false && hover) {
                const key = this.hovered

                const scaleVals = [0.95, 0.97, 0.98, 0.98, 0.98, 0.98]
                // const leftVals = [60, 30, 30, 30, 30, 30, 30]
                
                toSet[key].scale = toSet[key].scale * scaleVals[0];

                const increase = 2020 - toSet[key].translateZ;
                // console.log(increase)
                toSet[key].translateZ = 2020
                
                const rotateEq = ( -1.769315 + 0.00006264449*increase + 0.00007140726*Math.pow(increase,2) ) * 4;
                toSet[key].rotateY += key < 4 ? rotateEq : -7;
                
                if(key < 4) {
                    toSet[key].translateX += ( 1026.51 - 15.60256*increase + 0.0744692*Math.pow(increase,2) - 0.0001106055*Math.pow(increase,3) ) / 14.18
                } else {
                    toSet[key].translateX += ( 667.2059 - 8.958401*increase + 0.0367121*Math.pow(increase,2) - 0.00004923846*Math.pow(increase,3) ) / 14.18
                }

                // damn         inc 145     transx 0
                // leaveme      inc 232     transx -50
                // section      inc 340     transx -70
                // cherie       inc 385     transx -150

                for(var i=1; i<toSet.length; i++) {
                    if(key - i >= 0 && key-i !== 3) {
                        toSet[key-i].scale = toSet[key-i].scale * scaleVals[i];
                        // toSet[key-i].translateX = toSet[key-i].translateX + leftVals[i]
                        // toSet[key-i].translateX = toSet[key-i].translateX + (toSet[key+1].translateZ - toSet[key].translateZ)
                    }
                    if(key + i < toSet.length && key+i !== 3) {
                        toSet[key+i].scale = toSet[key+i].scale * scaleVals[i];
                        // toSet[key+i].translateX = toSet[key+i].translateX + leftVals[i]
                        // toSet[key+i].translateX = toSet[key+i].translateX + (toSet[key+1].translateZ - toSet[key].translateZ)
                    }
                }
            }
            this.currPosition = toSet;
        }),
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.player-view {
    perspective: 2000px;
    /*height: 800px;*/
    /*@include mq("small-monitor") {*/
    /*    width: 1150px;*/
    /*}*/
    /*@include mq("large-monitor") {*/
    /*    width: 1380px;*/
    /*}*/
    /*@include mq("huge-monitor") {*/
    /*    width: 1728px;*/
    /*}*/
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    background: rgb(11,0,43);
    /*background: linear-gradient(90deg, rgba(11,0,43,1) 0%, rgba(11,0,91,0.95) 33%, rgba(0,24,102,0.8) 63%, rgba(0,30,105,0.75) 77%, rgba(0,39,119,0.71) 85%, rgba(0,43,121,0.63) 90%, rgba(0,45,127,0.53) 95%, rgba(0,45,127,0.45) 98%, rgba(0,36,102,0.36) 100%);*/
    background: linear-gradient(90deg, rgba(11,0,43,1) 0%, rgba(0,24,102,0.8) 55%, rgba(11,0,43,1) 100%);
    position: relative;
    .player {
        width: 100%;
        height: 100%;
        position: absolute;
        transform-style: preserve-3d;
        transform: translateZ(-2000px);
        left: 0;
        top: 0;
    }
}

.line {
    display: flex;
    background-color: red;
    width: 100vw;
    justify-content: center;
}
</style>
