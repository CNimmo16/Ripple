<template>
    <!--<div class="player" id="player-view">-->
    <div class="player-view" @mousemove="getCurrPosition($event)">
        <div class="player">
            <TrackCard
                v-for="(track, index) in tracks" 
                :track="track" :key="index" 
                :position="currPosition[index]" 
                :current="current" 
                :trackChanging="trackChanging"
                @grow="grow(index)" 
                @shrink="shrink(index)" 
                @skip-to="skipTo(index)" 
                @play-next="playNext(index)"
                
                @skip-previous="skipPrevious"
                @skip-next="skipNext"
                @toggle-play="togglePlay()"
                @demo-alert="fireDemoAlert()" />
        </div>
        <!--<div class="line">|</div>-->
        <transition name="fade">
            <div class="demo-alert" v-if="demoAlertActive">Woah, this is just a demo application! There is no suggested song algorithm, so only 3 playable tracks have been included for demonstration purposes.</div>
        </transition>
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
        this.playAudio();
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
            demoAlertActive: false,
            positions: {
                mouseLeft: [
                    // vanishing
                    { rotateY: -25, translateZ: 1600, translateX: -62, scale: 0.38, opacity: 0.55 },
                    // previous tracks
                    { rotateY: -20, translateZ: 1680, translateX: -59.5, scale: 0.68, opacity: 0.55 },
                    { rotateY: -15, translateZ: 1760, translateX: -45.9, scale: 0.83, opacity: 0.25 },
                    { rotateY: -9, translateZ: 1840, translateX: -31.1, scale: 0.93, opacity: 0.15 },
                    { rotateY: -4, translateZ: 1920, translateX: -11.7, scale: 0.97, opacity: 0.07 },
                    // current track
                    { rotateY: 0, translateZ: 2000, translateX: 7.4, scale: 1, opacity: 0  },
                    // next tracks
                    { rotateY: 7, translateZ: 1800, translateX: 30.4, translateY: 0, scale: 0.81, opacity: 0.17  },
                    { rotateY: 7, translateZ: 1600, translateX: 45.3, translateY: -25.2, scale: 0.8, opacity: 0.4  },
                    { rotateY: 7, translateZ: 1400, translateX: 54.5, translateY: 13.1, scale: 0.79, opacity: 0.66  },
                    { rotateY: 7, translateZ: 1200, translateX: 65.8, translateY: -8.8, scale: 0.77, opacity: 0.8  },
                    // vanishing
                    { rotateY: 10, translateZ: 1100, translateX: 63, scale: 0.38, opacity: 0.9 },
                ],
                mouseRight: [
                    // vanishing
                    { rotateY: -20, translateZ: 1000, translateX: -62, scale: 0.58, opacity: 0.45 },
                    // previous tracks
                    { rotateY: -20, translateZ: 1200, translateX: -60.9, scale: 0.68, opacity: 0.45 },
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
                    { rotateY: 3, translateZ: 1600, translateX: 62, scale: 0.4, opacity: 0.9 },
                ]
            },
            hoverPositions: [
                { r: 9, t: 10 },
                
                { r: 9, t: 10 },
                { r: 7, t: 6 },
                { r: 6, t: 3 },
                { r: 3, t: -1 },
                { r: 0, t: 0 },
                { r: -3, t: 0 },
                { r: -4, t: -4 },
                { r: -5, t: -5 },
                { r: -5, t: -10 },
                
                { r: -5, t: -10 }
                
                // adhd     inc 380        r 9       trans 10
                // bullet       320         7           6
                // logique      240         6           3
                // dont@me      144         3           -1
                // greaze
                // loyalty      144         -3          0
                // leave        235         -4          -4
                // poemans      340         -5          -5
                // cherie       390         -5          -10     
            ],
            current: 5,
            isPlaying: true,
            tracks: [
                // Vanishing
                {
                    cover: require("@/assets/cover-art/skepta.jpg"),
                    artists: ["Skepta", "Nafe Smallz"],
                    title: "Greaze Mode",
                    type: "album",
                    album: "Ignorance is Bliss"
                },
                // Previous tracks
                {
                    cover: require("@/assets/cover-art/dont@me.jpg"),
                    artists: ["Jay Critch"],
                    title: "Don't @ Me",
                    type: "single",
                    album: "Don't @ Me"
                },
                {
                    cover: require("@/assets/cover-art/igor.jpg"),
                    artists: ["Tyler, The Creator"],
                    title: "NEW MAGIC WAND",
                    type: "album",
                    album: "IGOR"
                },
                {
                    cover: require("@/assets/cover-art/section80.jpg"),
                    artists: ["Kendrick Lamar"],
                    title: "A.D.H.D.",
                    type: "album",
                    album: "Section.80"
                },
                {
                    cover: require("@/assets/cover-art/eucalyptus.jpg"),
                    artists: ["Koresma", "Marley Carroll"],
                    title: "Eucalyptus",
                    type: "single",
                    album: "Eucalyptus",
                    audio: "eucalyptus"
                },
                // current track
                {
                    cover: require("@/assets/cover-art/impala.jpg"),
                    artists: ["Tame Impala"],
                    title: "Mind Mischief",
                    type: "album",
                    album: "Lonerism",
                    audio: "mind-mischief"
                },
                // next tracks
                {
                    cover: require("@/assets/cover-art/move-me.jpg"),
                    artists: ["Mura Masa", "Octavian"],
                    title: "Move Me",
                    type: "single",
                    album: "Move Me",
                    audio: "move-me"
                },
                {
                    cover: require("@/assets/cover-art/third-room.jpg"),
                    artists: ["Khruangbin"],
                    title: "Evan Finds the Third Room",
                    type: "album",
                    album: "Con Todo El Mundo"
                },
                {
                    cover: require("@/assets/cover-art/lime-cordiale.jpg"),
                    artists: ["Lime Cordiale"],
                    title: "Temper Temper",
                    type: "album",
                    album: "Permanent Vacation"
                },
                {
                    cover: require("@/assets/cover-art/julien.jpg"),
                    artists: ["Damso"],
                    title: "Julien",
                    type: "album",
                    album: "Lithopédion"
                },
                // Vanishing
                // {
                //     cover: require("@/assets/cover-art/logique.jpg"),
                //     artists: ["-M-"],
                //     title: "Logique est ton écho",
                //     type: "album",
                //     album: "Lettre infinie"
                // },
            ]
        }
    },
    methods: {
        playAudio() {
            var currentAudio = this.tracks[this.current].audio
            if(this.audioElem) {
                this.audioElem.removeEventListener("ended", this.skipNext)
                this.audioElem.pause();
                this.audioElem.src = require('@/assets/audio/' + currentAudio + '.mp3');
                this.audioElem.load()
            } else {
                this.audioElem = new Audio(require('@/assets/audio/' + currentAudio + '.mp3'));
            }
            this.audioElem.addEventListener("loadedmetadata", (event) => {
                this.audioElem.play();
                this.$store.commit("setPosition", 0)
                this.$store.commit("setDuration", event.path[0].duration)
            })
            this.audioElem.addEventListener("ended", this.skipNext)
        },
        fireDemoAlert() {
            if(this.demoAlertActive === false) {
                this.demoAlertActive = true;
                window.setTimeout(() => {
                    this.demoAlertActive = false;
                }, 5000)
            }
        },
        grow(key) {
            // never grow current track
            if(key !== this.current) {
                this.hovered = key
            }
            this.getCurrPosition(null);
        },
        shrink() {
            this.hovered = null;
            this.getCurrPosition();
        },
        playNext(key) {
            // this.trackChanging = true;
            this.tracks.splice(this.current+1, 0, this.tracks.splice(key, 1)[0]);
            this.playAudio()
        },
        togglePlay() {
            if(this.isPlaying) {
                this.audioElem.pause();
                this.isPlaying = false;
                this.$store.commit("setPosition", this.audioElem.currentTime)
            } else {
                this.audioElem.play()
                this.isPlaying = true;
            }
        },
        skipPrevious() {
            if(this.current > 4) {
                this.skipTo(this.current-1)
            } else {
                this.fireDemoAlert()
            }
        },
        skipNext() {
            if(this.current < 6) {
                this.skipTo(this.current+1)  
            } else {
                this.fireDemoAlert()
            }
        },
        skipTo(key) {
            if(key !== this.current) {
                this.current = key
                
                this.trackChanging = true;
                this.getCurrPosition()
                window.setTimeout(() => {
                    this.trackChanging = false;
                    this.playAudio()
                }, 500)
            }
        },
        getCurrPosition: throttle(100, function(event) {
            const bounds = window.document.getElementsByClassName("player-view")[0].getBoundingClientRect()
            const leftness = event ? (event.clientX - bounds.x) / bounds.width : 0.5;

            let toSet = []
            
            let startFrom = 5 - this.current
            
            let positions = null
            if(startFrom > 0) { 
                positions = {
                    mouseLeft: this.positions.mouseLeft.slice(startFrom),
                    mouseRight: this.positions.mouseRight.slice(startFrom)
                }
            } else if(startFrom < 0) {
                positions = {
                    mouseLeft: [{ rotateY: -25, translateZ: 1400, translateX: -62, scale: 0.38, opacity: 0.55 }].concat(this.positions.mouseLeft).concat([{}]),
                    mouseRight: [{ rotateY: -25, translateZ: 600, translateX: -62, scale: 0.38, opacity: 0.55 }].concat(this.positions.mouseRight).concat([{}])
                }
            } else {
                positions = this.positions;
            }
            
            for(let i=0; i<positions.mouseLeft.length; i++) {
                // const params = ["translateZ", "rotateY", "scale"]
                let toPush = {};
                for (const [key] of Object.entries(positions.mouseLeft[i])) {
                    const a = positions.mouseLeft[i][key];
                    const b = positions.mouseRight[i][key];
                    toPush[key] = a + ((b-a) * leftness)
                }
                toSet.push(toPush)
            }
            if(typeof this.hovered === "number" && this.trackChanging === false && this.hovered !== this.current) {
                const key = this.hovered

                const scaleVals = [0.95, 0.97, 0.98, 0.98, 0.98, 0.98]
                // const leftVals = [60, 30, 30, 30, 30, 30, 30]
                
                toSet[key].scale = toSet[key].scale * scaleVals[0];

                const increase = 2020 - toSet[key].translateZ;
                toSet[key].translateZ = 2020
                
                // const rotateEq = ( -1.769315 + 0.00006264449*increase + 0.00007140726*Math.pow(increase,2) ) * 4;
                // toSet[key].rotateY += key < 6 ? rotateEq : -7;
                
                toSet[key].rotateY += this.hoverPositions[key - (this.current - 5)].r
                toSet[key].translateX += this.hoverPositions[key - (this.current - 5)].t
                
                // adhd     inc 380        r 9       trans 10
                // bullet       320         7           6
                // logique      240         6           3
                // dont@me      144         3           -1
                // greaze
                // loyalty      144         -3          0
                // leave        235         -4          -4
                // poemans      340         -5          -5
                // cherie       390         -5          -10    
                
                // if(key < 6) {
                //     toSet[key].translateX += ( 1026.51 - 15.60256*increase + 0.0744692*Math.pow(increase,2) - 0.0001106055*Math.pow(increase,3) ) / 14.18
                // } else {
                //     toSet[key].translateX += ( 667.2059 - 8.958401*increase + 0.0367121*Math.pow(increase,2) - 0.00004923846*Math.pow(increase,3) ) / 14.18
                // }

                for(var i=1; i<toSet.length; i++) {
                    if(key - i >= 5 && key-i !== this.current) {
                        toSet[key-i].scale = toSet[key-i].scale * scaleVals[i];
                        // toSet[key-i].translateX = toSet[key-i].translateX + leftVals[i]
                        // toSet[key-i].translateX = toSet[key-i].translateX + (toSet[key+1].translateZ - toSet[key].translateZ)
                    }
                    if(key + i < toSet.length-6 && key+i !== this.current) {
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

.demo-alert {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 4%;
    background-color: rgba(0,0,0,0.7);
    color: #fff;
    border-radius: 450px;
    text-align: center;
    font-size: 1em;
    padding: 5px 20px;
    pointer-events: none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
