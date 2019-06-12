import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        spotifyToken: null,
        duration: 0,
        position: 0
    },
    mutations: {
        setToken(state, token) {
            state.spotifyToken = token;
        },
        setDuration(state, duration) {
            state.duration = duration;
        },
        setPosition(state, position) {
            state.position = position;
        }
    },
    actions: {
        
    }
})
