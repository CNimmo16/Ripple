<template>
    <!--<div class="player" id="player-view">-->
    <div class="player-view" @mousemove="getCurrPosition($event)">
        <div class="player">
            <TrackCard v-for="(track, index) in tracks" :track="track" :key="index" :position="currPosition[index]" @grow="grow(index)" @shrink="shrink(index)" />
        </div>
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
            positions: {
                mouseLeft: [
                    // previous tracks
                    { rotateY: -20, translateZ: 1760, translateX: -680, scale: 0.83, opacity: 0.25 },
                    { rotateY: -12, translateZ: 1840, translateX: -460, scale: 0.93, opacity: 0.15 },
                    { rotateY: -6, translateZ: 1920, translateX: -210, scale: 0.97, opacity: 0.07 },
                    // current track
                    { rotateY: 0, translateZ: 2000, translateX: 110, scale: 1, opacity: 0  },
                    // next tracks
                    { rotateY: 7, translateZ: 1800, translateX: 480, translateY: 0, scale: 0.81, opacity: 0.17  },
                    { rotateY: 7, translateZ: 1600, translateX: 700, translateY: -230, scale: 0.8, opacity: 0.4  },
                    { rotateY: 7, translateZ: 1400, translateX: 830, translateY: 120, scale: 0.79, opacity: 0.66  },
                    { rotateY: 7, translateZ: 1200, translateX: 1060, translateY: -80, scale: 0.77, opacity: 0.8  },
                ],
                mouseRight: [
                    // previous tracks
                    { rotateY: -37, translateZ: 1400, translateX: -780, scale: 0.75, opacity: 0.66 },
                    { rotateY: -25, translateZ: 1600, translateX: -620, scale: 0.82, opacity: 0.4 },
                    { rotateY: -13, translateZ: 1800, translateX: -400, scale: 0.93, opacity: 0.17 },
                    // current track
                    { rotateY: 0, translateZ: 2000, translateX: -130, scale: 1, opacity: 0 },
                    // next tracks
                    { rotateY: 3, translateZ: 1920, translateX: 220, translateY: 0, scale: 0.9, opacity: 0.17 },
                    { rotateY: 3, translateZ: 1840, translateX: 550, translateY: -230, scale: 0.8, opacity: 0.07  },
                    { rotateY: 3, translateZ: 1760, translateX: 560, translateY: 180, scale: 0.73, opacity: 0.07  },
                    { rotateY: 3, translateZ: 1680, translateX: 880, translateY: 20, scale: 0.72, opacity: 0.07  },
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
            if(key !== 3) {
                this.hovered = key
            }
            this.getCurrPosition();
        },
        shrink() {
            this.hovered = null;
            this.getCurrPosition();
        },
        getCurrPosition: throttle(100, function(event) {
            const bounds = window.document.getElementsByClassName("player-view")[0].getBoundingClientRect()
            // const pWidth = bounds.width - window.document.getElementsByClassName("track-card")[0].clientWidth;
            const leftness = event ? (event.clientX - bounds.x) / bounds.width : 0.5;

            let toSet = []
            for(let i=0; i<this.tracks.length; i++) {
                // const params = ["translateZ", "rotateY", "scale"]
                let toPush = {};
                for (const [key] of Object.entries(this.positions.mouseLeft[i])) {
                    const a = this.positions.mouseLeft[i][key];
                    const b = this.positions.mouseRight[i][key];
                    toPush[key] = a + ((b-a) * leftness)
                }
                toSet.push(toPush)
            }
            if(typeof this.hovered === "number") {
                const key = this.hovered

                const scaleVals = [0.95, 0.97, 0.98, 1, 1, 1]
                // const leftVals = [60, 30, 30, 30, 30, 30, 30]
                
                toSet[key].scale = toSet[key].scale * scaleVals[0];

                const increase = 2020 - toSet[key].translateZ;
                // console.log(increase)
                toSet[key].translateZ = 2020
                toSet[key].rotateY += ( -1.769315 + 0.00006264449*increase + 0.00007140726*Math.pow(increase,2) ) * 2
                if(key < 4) {
                    toSet[key].translateX += ( 1026.51 - 15.60256*increase + 0.0744692*Math.pow(increase,2) - 0.0001106055*Math.pow(increase,3) )
                } else {
                    toSet[key].translateX += ( 667.2059 - 8.958401*increase + 0.0367121*Math.pow(increase,2) - 0.00004923846*Math.pow(increase,3) )
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
    height: 800px;
    width: 90%;
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
        left: 650px;
        top: 150px;
    }
}
</style>
