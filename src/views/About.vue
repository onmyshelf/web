<template>
  <main class="container">
    <h1>{{ $t("About") }}</h1>
    <p>{{ $t("Powered by OnMyShelf") }}</p>
    <p v-if="version">{{ $t("API version") }}: {{ version }}</p>
    <p>{{ $t("About OnMyShelf") }}</p>
    <p>
      {{ $t("Official website") }}:
      <a href="https://onmyshelf.app">https://onmyshelf.app</a>
    </p>
    <img src="/assets/images/logo.svg" />
  </main>
</template>

<script>
export default {
  data() {
    return {
      version: null,
    }
  },
  created() {
    // get API info
    this.$apiGet("").then((response) => {
      if (response.data.version) {
        this.version = response.data.version
      }
    })
  }
}
</script>
