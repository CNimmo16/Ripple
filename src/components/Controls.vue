<template>
    <div class="controls" @mousemove.stop="" :class="{ active: active }">
        <div class="play-controls">
            <div class="loop icon">
                <img src="@/assets/icons/player/repeat-one.svg">
            </div>
            <div class="previous icon">
                <img src="@/assets/icons/player/previous.svg" @click.stop="$emit('skip-previous')">
            </div>
            <div class="play icon" @click="togglePlay">
                <img v-if="!isPlaying" src="@/assets/icons/player/play.svg">
                <img v-else src="@/assets/icons/player/pause.svg">
            </div>
            <div class="next icon" @click.stop="$emit('skip-next')">
                <img src="@/assets/icons/player/next.svg">
            </div>
            <div class="shuffle icon">
                <img src="@/assets/icons/player/shuffle.svg">
            </div>
        </div>
        <ProgressBar :active="active" :index="index" :isPlaying="isPlaying" />
    </div>
</template>

<script>
    import ProgressBar from "@/components/ProgressBar.vue"
    import {Howl, Howler} from 'howler';
    
    export default {
        name: "Controls",
        data() {
            return {
                isPlaying: true,
                playerID: null,
            }
        },
        props: ["active", "index"],
        components: {
            ProgressBar
        },
        methods: {
            togglePlay() {
                this.$emit('toggle-play');
                this.isPlaying = !this.isPlaying;
            }
        }
    }
</script>

<style lang="scss" scoped>
.controls {
    position: absolute;
    display: flex;
    flex-direction: column-reverse;
    top: 100%;
    left: 0;
    right: 0;
    z-index: -5;
    transform: translateY(-85px);
    transition: transform 0.3s;
    &.active {
        transform: translateY(0);
    }
    .play-controls {
        /*transition: transform 0.3s;*/
        display: flex;
        background-color: #000;
        height: 65px;
        align-items: center;
        justify-content: center;
        .icon {
            width: 42px;
            height: 42px;
            margin: 0 8px;
            transition: transform 0.2s;
            transform-origin: 50% 70%;
            &:hover {
                transform: scale(1.06);
                img {
                    filter: invert(0.8);
                }
            }
            img {
                filter: invert(1);
                transition: filter 0.2s;
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>