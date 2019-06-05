<template>
    <div class="controls" @mousemove.stop="">
        <div class="play-controls">
            <div class="loop icon">
                <img src="@/assets/icons/player/repeat-one.svg">
            </div>
            <div class="previous icon">
                <img src="@/assets/icons/player/previous.svg" @click="previous()">
            </div>
            <div class="play icon" @click.stop="togglePlay($event)" @touchstart.stop="togglePlay($event)">
                <img v-if="isPaused" src="@/assets/icons/player/play.svg">
                <img v-else src="@/assets/icons/player/pause.svg">
            </div>
            <div class="next icon" @click="next()">
                <img src="@/assets/icons/player/next.svg">
            </div>
            <div class="shuffle icon">
                <img src="@/assets/icons/player/shuffle.svg">
            </div>
        </div>
        <ProgressBar />
    </div>
</template>

<script>
    import ProgressBar from "@/components/ProgressBar.vue"
    
    export default {
        name: "Controls",
        data() {
            return {
                isPaused: true
            }
        },
        components: {
            ProgressBar
        },
        mounted() {
            this.$loadScript("https://sdk.scdn.co/spotify-player.js")
            .then(() => {
                this.initiatePlayer();
            })
            .catch(() => {
                // Failed to fetch script
            });  
        },
        methods: {
            waitForSpotifyWebPlaybackSDKToLoad: async function () {
                return new Promise(resolve => {
                    if (window.Spotify) {
                        resolve(window.Spotify)
                    } else {
                        window.onSpotifyWebPlaybackSDKReady = () => {
                            resolve(window.Spotify)
                        }
                    }
                })
            },
            initiatePlayer: async function () {
                const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad()
                this.spotifyPlayer = new Player({
                    name: 'Ripple',
                    volume: 1.0,
                    getOAuthToken: callback => { callback(this.$store.state.token) }
                })
                // Error handling
                this.spotifyPlayer.addListener('initialization_error', ({ message }) => { console.log('Initialization_error: ' + message) })
                this.spotifyPlayer.addListener('authentication_error', ({ message }) => { console.log('Authentication_error: ' + message) })
                this.spotifyPlayer.addListener('account_error', ({ message }) => { console.log('Account_error: ' + message) })
                this.spotifyPlayer.addListener('playback_error', ({ message }) => { console.log('Playback_error: ' + message) })
                // Playback status updates
                this.spotifyPlayer.addListener('player_state_changed', state => {
                    // If playback transferred away advice user
                    // if(!state) {
                    //     this.$refs["playbackTransferredModal"].open()
                    //     this.playing = null;
                    //      window.clearInterval(window.int)
                    //     this.positionRaw = 0;
                    //     this.durationRaw = 0;
                    // }
                })
                // Ready
                this.spotifyPlayer.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device Id: ', device_id)
                    this.$store.commit("setPlayerId", device_id)
                    this.playerID = device_id;
                })
                // Not Ready
                this.spotifyPlayer.addListener('not_ready', ({ device_id }) => {
                    console.log('Not ready with device Id: ', device_id)
                })
                this.spotifyPlayer.connect()
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
    .play-controls {
        transform: translateY(-65px);
        /*transition: transform 0.3s;*/
        display: flex;
        background-color: #000;
        transition: transform 0.3s;
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