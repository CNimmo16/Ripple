<template>
  <div id="app">
    <PlayerView />
  </div>
</template>

<script>
import PlayerView from './components/PlayerView.vue'

export default {
  name: 'app',
  components: {
    PlayerView
  },
  mounted() {
    // if(window.location.pathname.slice(0,9) !== "/play") {
    //   var scopes = 'playlist-read-private playlist-read-collaborative playlist-modify-private user-read-playback-state user-modify-playback-state streaming user-read-birthdate user-read-email user-read-private user-library-read';
    //   window.location.href = "https://accounts.spotify.com/authorize"
    //   + "?client_id=a1e165ead0e74ae299f926b4c798fe33"
    //   + "&scope=" + encodeURIComponent(scopes)
    //   // + "&redirect_uri=https://c5fabfda147e4c05adbc377391e4eaaa.vfs.cloud9.eu-west-1.amazonaws.com/play"
    //   + "&redirect_uri=" + window.location.origin + "/play"
    //   + "&response_type=token"
    // } else {
    //   let token = window.location.hash.substr(1)
    //   let token2 = token.substr(token.indexOf("=")+1)
    //   let token3 = token2.substr(0, token2.indexOf("&"))
    //   this.$spotify.setAccessToken(token3);
    //   this.$store.commit("setToken", token3)
    // }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
