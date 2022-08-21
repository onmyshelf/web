<template>
  <div class="about container">
    <h1>{{ $t("About") }}</h1>
    <div class="alert alert-info" role="alert">
      OnMyShelf is still in development.<br/>
      Some key features you expects may be missing,
      but we work hard to make it be the best collection manager!
    </div>
    <h2>About this instance</h2>
    <ul>
      <li>Web interface: <router-link to="/">{{rootUrl}}</router-link></li>
      <li>Server API: <a :href="apiUrl">{{apiUrl}}</a></li>
    </ul>
    <h2>About OnMyShelf project</h2>
    <p>OnMyShelf is a powerful open source collection manager.</p>
    <p>Official website: <a href="https://onmyshelf.cm">https://onmyshelf.cm</a></p>
  </div>
</template>

<script>
export default {
  computed: {
    // return the root URL
    rootUrl() {
      // get current URL without /about
      let currentURL = window.location.href
      currentURL = currentURL.substring(0, currentURL.lastIndexOf( "/" ) + 1)

      // ignore last "/"
      if (currentURL.substr(-1) == '/') {
        return currentURL.substring(0, currentURL.length-1)
      }

      return currentURL
    },

    // return the API URL
    apiUrl() {
      // return external API address
      if (import.meta.env.VITE_API_URL.substring(0,4) == 'http') {
        return import.meta.env.VITE_API_URL
      }
      // return same URL + API path
      return this.rootUrl + import.meta.env.VITE_API_URL
    },

    // return the media URL
    mediaUrl() {
      // return external API address
      if (import.meta.env.VITE_MEDIA_URL.substring(0,4) == 'http') {
        return import.meta.env.VITE_MEDIA_URL
      }
      // return same URL + API path
      return this.rootUrl + import.meta.env.VITE_MEDIA_URL
    }
  }
}
</script>
