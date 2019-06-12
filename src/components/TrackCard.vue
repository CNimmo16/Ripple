<template>
    <div class="track-card"
        @click.stop="handleClick()" 
        @mouseenter.stop="$emit('grow', $vnode.key)" 
        @mouseleave.stop="$emit('shrink', $vnode.key)" 
        :class="{ current: $vnode.key === current, previous: $vnode.key < current, next: $vnode.key > current }">
        <article>
            <div class="track-header" :class="{ active: $vnode.key === current && trackChanging === false }">
                Now Playing
            </div>
            <div class="track-header" :class="{ active: $vnode.key === current+1 && trackChanging === false }">
                Up next
            </div>
            <img class="cover" :src="track.cover">
            <div class="artists">
                <span class="main">{{ track.artists[0] }}</span>
                <span class="features" v-if="track.artists.length > 1">
                    feat. 
                    <span v-for="(artist, index) in track.artists.slice(1)" :key="index">{{ artist }}</span>
                </span>
            </div>
            <h2 class="title">{{ track.title }}</h2>
            <div class="album">
                <img v-if="track.type === 'album'" src="@/assets/icons/album.svg">
                <img v-else src="@/assets/icons/single.svg">
                <h3>{{ track.album }}</h3>
            </div>
            <div v-if="position" class="overlay" :style="{ opacity: position.opacity*2 }"></div>
            
            <Controls :active="$vnode.key === current && trackChanging === false" @skip-previous="$emit('skip-previous')" @skip-next="$emit('skip-next')" @toggle-play="$emit('toggle-play')" :index="$vnode.key" />
            
            <button class="return button" v-if="$vnode.key < current">
                Click to return to track
            </button>
            <button class="next" v-if="$vnode.key === current+1">
                Click to skip to track
            </button>
            <button class="next button" v-if="$vnode.key > current+1">
                Click to play next
            </button>
        </article>
    </div>
</template>

<script>
    // import { debounce, throttle } from "throttle-debounce";
    import Controls from "@/components/Controls.vue"

    export default {
        name: "TrackCard",
        props: ["track", "position", "current", "trackChanging"],
        components: {
            Controls
        },
        watch: {
            position(newValue) {
                const vars = {}
                const playerBounds = window.document.getElementsByClassName("player-view")[0].getBoundingClientRect()
                const cardHeight = window.document.getElementsByClassName("track-card")[0].clientHeight
                if(newValue.translateX) { 
                    const cardWidth = window.document.getElementsByClassName("track-card")[0].clientWidth
                    const calc = playerBounds.width - cardWidth;
                    const transx = ( newValue.translateX * calc / 100 ) - cardWidth / 2
                    vars.x = ( newValue.translateX * calc / 100 ) - cardWidth / 2
                } else { vars.x = 0 }
                vars.y = newValue.translateY ? (( newValue.translateY * playerBounds.height / 100 ) - cardHeight / 2) : cardHeight / 2 * -1
                // if(newValue.translateY) { 
                //     vars.y = ( newValue.translateY * playerBounds.height / 100 ) - cardHeight / 2
                // } else {
                //     vars.y = cardHeight / 2 * -1
                // }
                vars.z = newValue.translateZ ? newValue.translateZ : 2000
                if(newValue.scale) { 
                    let newScale = newValue.scale * ((playerBounds.height + 913) / 1850)
                    if(newScale * cardHeight * 1.3 > playerBounds.height - 20) {
                        newScale = (playerBounds.height - 20) / (cardHeight * 1.3)
                    }
                    vars.scale = newScale
                } else { vars.scale = 1 }
                vars.rotationY = newValue.rotateY ? newValue.rotateY : 0;
                this.$gsap.to(this.$el, 0.5, {css: vars});
            },
        },
        methods: {
            handleClick() {
                if(this.$vnode.key >= 4 && this.$vnode.key <= 6) {
                    if(this.$vnode.key <= this.current + 1) {
                        this.$emit('skip-to', this.$vnode.key)
                    } else {
                        this.$emit('play-next', this.$vnode.key)
                    }
                } else {
                    this.$emit("demo-alert")
                }
            }
        }
    }
</script>

<style lang="scss">
    .track-card {
        width: 350px;
        height: 520px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: absolute;
        left: 50%;
        top: 50%;
        box-sizing: border-box;
        &.previous article {
            .overlay { background: linear-gradient(to right, rgb(11, 0, 45) 0%, rgba(11, 0, 45, 0.6) 20%, rgba(0, 0, 0, 0.4) 100%); }
            cursor: pointer;
            &:hover {
                .overlay { opacity: 0 !important; }
                button {
                    transform: translateY(0) !important;
                }
            }
        }
        &.next article {
            /*.overlay { background: linear-gradient(to right, rgba(226,226,226,0.2) 0%, rgba(219,219,219,0.3) 80%, rgba(0,45,127,0.2) 100%); }*/
            .overlay { background: linear-gradient(to left, rgb(11, 0, 45) 0%, rgba(11, 0, 45, 0.6) 20%, rgba(0, 0, 0, 0.4) 100%); }
            cursor: pointer;
            &:hover {
                .overlay { opacity: 0 !important; }
                button {
                    transform: translateY(0) !important;
                }
            }
        }
        article {
            position: relative;
            width: 100%;
            box-sizing: border-box;
            height: fit-content;
            display: flex;
            flex-direction: column;
            padding: 20px;
            box-shadow: -1.5px -1.2px 4.5px 0 rgba(0,0,0,0.5);
            background-color: #fff;
            .cover {
                width: 310px;
                height: 310px;
            }
            .artists {
                font-weight: 300;
                margin-top: 10px;
                .main {
                    font-size: 19px;
                    margin-right: 6px;
                }
                .features {
                    font-size: 13px;
                }
            }
            .title {
                font-size: 36px;
                font-weight: 600;
                margin: 1px 0 5px 0;
                line-height: 1.15;
            }
            .album {
                display: flex;
                align-items: center;
                img {
                    width: 24px;
                    height: 24px;
                    margin-right: 7px;
                    opacity: 0.6;
                }
                h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 400;
                    color: #666666;
                }
            }
        }
        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none
        }
        .track-header {
            z-index: -5;
            position: absolute;
            bottom: 100%;
            left: 0;
            width: 100%;
            background-color: #000;
            color: #fff;
            font-size: 1.4em;
            font-weight: 500;
            padding: 10px;
            box-sizing: border-box;
            transform: translateY(50px);
            transition: transform 0.3s;
            &.active {
                transform: translateY(0);
            }
        }
        button {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            height: 45px;
            font-size: 1.2em;
            transform: translateY(-45px);
            transition: transform 0.5s ease;
            cursor: pointer;
            z-index: -1;
            border: none;
            outline: none;
            background-color: #67da95;
        }
    }
</style>