<template>
    <div class="controls" @mousemove.stop="">
        <div class="play-controls" :class="{ paused: isPaused }">
            <div class="loop icon">
                <img src="@/assets/icons/player/repeat-one.svg">
            </div>
            <div class="previous icon">
                <img src="@/assets/icons/player/previous.svg" @click="previous()">
            </div>
            <div class="play icon" @click="togglePlay($event)">
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
                isPaused: true,
                playerID: null,
            }
        },
        computed: {
            playlist() {
                return this.$store.state.playlist
            }
        },
        components: {
            ProgressBar
        },
        mounted() {
            this.$loadScript("https://sdk.scdn.co/spotify-player.js")
            .then(() => {
                this.initiatePlayer();
                window.setTimeout(this.playFromState, 4000);
            })
            .catch(() => {
                // Failed to fetch script
            });  
        },
        methods: {
            resume() {
                console.log("playing")
                this.spotifyPlayer.resume().then(() => {
                    this.isPaused = false;
                    // this.slideBar(this.positionRaw);
                })
            },
            pause() {
                console.log("pausing")
                this.spotifyPlayer.pause().then(() => {
                    window.clearInterval(window.int)
                    this.isPaused = true;
                })
            },
            togglePlay() {
                if(this.isPaused) {
                    this.resume()
                } else {
                    this.pause()
                }
            },
            async playFromState(playlist, currIndex) {
                // const currAlbum = this.playlist[3]
                const currAlbum = "3qhdxKqksjkX6l8NDXz0as"

                this.$spotify.getRecommendations({
                    seed_tracks: ["6gRbkI6s0M7zTE9uhRZUjV"]
                }).then((data) => {
                    // const uriArray = data.tracks.map((track) => {
                    //     return track.uri
                    // })
                    // console.log(uriArray)
                    const uriArray = ["spotify:track:6gRbkI6s0M7zTE9uhRZUjV"]
                    this.playSpotify(currAlbum, uriArray)
                });
            },
            playSpotify(album, uriArray) {
                var options = {
                    uris: uriArray
                }
                // Get user's playback state
                this.$spotify.getMyCurrentPlaybackState((err, res) => {
                    if(err) {
                        this.active = null;
                    } else if(res.device && res.device.id === this.playerID) {
                        options.device_id = this.playerID
                        this.spotifyPlayWithAPI(options, album);
                        this.active = true;
                    } else {
                        options.device_id = this.playerID
                        this.transferSpotifyPlaybackToDropt(options, album);
                        this.active = true;
                    }
                });
            },
            spotifyPlayWithAPI(options, album) {
                this.$spotify.play(options).then(() => {
                    this.isPaused = false;
                    this.currPlatform = "spotify";
                    this.setPlaying(album);
                })
            },
            transferSpotifyPlaybackToDropt(options, album) {
                this.$spotify.transferMyPlayback([this.playerID]).then(() => {
                    if(options) {
                        window.setTimeout(() => {
                            this.spotifyPlayWithAPI(options, album)
                        }, 500)
                    }
                })
            },
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
                    getOAuthToken: callback => { callback(this.$store.state.spotifyToken) }
                })
                // Error handling
                // this.spotifyPlayer.addListener('initialization_error', ({ message }) => { console.log('Initialization_error: ' + message) })
                // this.spotifyPlayer.addListener('authentication_error', ({ message }) => { console.log('Authentication_error: ' + message) })
                // this.spotifyPlayer.addListener('account_error', ({ message }) => { console.log('Account_error: ' + message) })
                // this.spotifyPlayer.addListener('playback_error', ({ message }) => { console.log('Playback_error: ' + message) })
                // Playback status updates
                this.spotifyPlayer.addListener('player_state_changed', state => {
                    // If playback transferred away advice user
                    if(!state) {
                        this.$refs["playbackTransferredModal"].open()
                        this.playing = null;
                         window.clearInterval(window.int)
                        this.positionRaw = 0;
                        this.durationRaw = 0;
                    }
                })
                // Ready
                this.spotifyPlayer.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device Id: ', device_id)
                    // this.$store.commit("setPlayerId", device_id)
                    this.playerID = device_id;
                })
                // Not Ready
                // this.spotifyPlayer.addListener('not_ready', ({ device_id }) => {
                    // console.log('Not ready with device Id: ', device_id)
                // })
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
        &.paused {
            transform: translateY(0);
        }
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