<template>
    <div class="track-card" @mouseenter="$emit('grow', $vnode.key)" @mouseleave="$emit('shrink', $vnode.key)" :class="{ current: $vnode.key === 3, previous: $vnode.key < 3, next: $vnode.key > 3 }">
        <article>
            <div class="current-track-header" v-if="$vnode.key === 3">
                Now Playing
            </div>
            <div class="current-track-header" v-if="$vnode.key === 4">
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
                <img src="@/assets/icons/album.svg">
                <h3>{{ track.album }}</h3>
            </div>
            <div class="overlay" :style="{ opacity: position.opacity*2 }"></div>
            
            <Controls v-if="$vnode.key === 3" />
            <button class="return-button" v-if="$vnode.key < 3">
                Click to return to track
            </button>
            <button class="return-button" v-if="$vnode.key === 4">
                Currently playing next
            </button>
            <button class="return-button" v-if="$vnode.key > 4">
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
        props: ["track", "position"],
        components: {
            Controls
        },
        computed: {
            styles() {
                return {
                    transform: `scale(${this.scale}) translateX(${this.left}px)`
                }
            }
        },
        watch: {
            position(newValue) {
                const vars = {}
                if(newValue.translateX) { vars.x = newValue.translateX }
                if(newValue.translateY) { vars.y = newValue.translateY }
                if(newValue.translateZ) { vars.z = newValue.translateZ }
                if(newValue.scale) { vars.scale = newValue.scale }
                if(newValue.rotationY) { vars.rotationY = newValue.rotationY }
                this.$gsap.to(this.$el, 0.2, {css: vars});
            },
        },
    }
</script>

<style lang="scss">
    .track-card {
        width: 310px;
        height: 520px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: absolute;
        left: 10px;
        top: 10px;
        &.previous article {
            .overlay { background: linear-gradient(to right, rgb(11, 0, 45) 0%, rgba(11, 0, 45, 0.6) 20%, rgba(0, 0, 0, 0.4) 100%); }
            cursor: pointer;
            &:hover {
                .overlay { opacity: 0 !important; }
                .return-button {
                    transform: translateY(0) !important;
                }
            }
        }
        &.current article {
            &:hover { 
                .play-controls { transform: translateY(0) }; 
            }
        }
        &.next article {
            /*.overlay { background: linear-gradient(to right, rgba(226,226,226,0.2) 0%, rgba(219,219,219,0.3) 80%, rgba(0,45,127,0.2) 100%); }*/
            .overlay { background: linear-gradient(to left, rgb(11, 0, 45) 0%, rgba(11, 0, 45, 0.6) 20%, rgba(0, 0, 0, 0.4) 100%); }
            cursor: pointer;
            &:hover {
                .overlay { opacity: 0 !important; }
                .return-button {
                    transform: translateY(0) !important;
                }
            }
        }
        article {
            position: relative;
            width: 100%;
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
        .current-track-header {
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
        }
        .return-button {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: #67da95;
            height: 45px;
            font-size: 1.2em;
            transform: translateY(-45px);
            transition: transform 0.5s ease;
            cursor: pointer;
            z-index: -1;
            border: none;
            outline: none;
        }
    }
</style>