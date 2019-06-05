import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// Vuex for state
import Vuex from 'vuex'
Vue.use(Vuex)

// Vue load script for non-npm packages
import LoadScript from 'vue-plugin-load-script';
Vue.use(LoadScript);

// Spotify API for music playback and exploration
var Spotify = require('spotify-web-api-js');
var spotifyApi = new Spotify();
Object.defineProperty(Vue.prototype, '$spotify', { value: spotifyApi });

// Gsap for various animations
import { TweenMax } from "gsap/TweenMax";

import store from './store'
Object.defineProperty(Vue.prototype, '$gsap', { value: TweenMax });

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
