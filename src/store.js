import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        spotifyToken: null,
        playlist: [
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
    },
    mutations: {
        setToken(state, token) {
            state.spotifyToken = token;
        }
    },
    actions: {
        
    }
})
