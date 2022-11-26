<template>
  <header>
    <nav class="navbar navbar-expand navbar-light bg-light">
      <div class="container container-fluid">
        <a class="navbar-brand" href="#">
          <img src="/assets/images/logo.svg" /> OnMyShelf
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#topmenu" aria-controls="topmenu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="topmenu">
          <ul class="navbar-nav me-auto">
            <li v-if="$demoMode()">
              <span class="badge text-bg-warning">{{ $t("DEMO") }}</span>
            </li>
            <li class="nav-item">
              <router-link to="/" class="nav-link active">
                {{ $t("Home") }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link">
                {{ $t("About") }}
              </router-link>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" @click="langSelector = ! langSelector">
                {{ $languages[$currentLanguage] }}
              </a>
              <ul v-if="langSelector" class="dropdown-menu">
                <li v-for="(language, key) in $languages" :key="key">
                  <a class="dropdown-item" href="#" @click="changeLanguage(key)">{{ language }}</a>
                </li>
              </ul>
            </li>

            <template v-if="$isLoggedIn()">
              <li class="nav-item">
                <router-link to="/profile" class="nav-link">{{ $t("My profile") }}</router-link>
              </li>
              <li class="nav-item">
                <a @click="logout" href="#" class="nav-link">{{ $t("Sign out") }}</a>
              </li>
            </template>
            <li v-else class="nav-item">
              <router-link to="/login" class="nav-link">{{ $t("Sign in") }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.navbar-brand img {
  max-height: 2em;
  margin-right: 0.5em;
}
</style>

<script>
export default {
  data() {
    return {
      langSelector: false,
    }
  },
  created() {
    // set default if not exists
    if (!localStorage.getItem("onmyshelf_lang")) {
      localStorage.setItem("onmyshelf_lang", "en_US")
      // refresh page
      this.$router.go()
    }
  },
  methods: {
    changeLanguage(lang) {
      localStorage.setItem("onmyshelf_lang", lang)
      // refresh page
      this.$router.go()
    },
    logout() {
      // tell API to delete token
      this.$apiDelete("token").then(() => {
        // clean local storage
        this.$cleanSession()
        this.$router.go("/")
      })
    },
  },
}
</script>
