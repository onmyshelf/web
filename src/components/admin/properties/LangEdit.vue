<template>
  <div class="input-group mb-3">
    <input v-model="translations[lang]" type="text" class="form-control" aria-label="Text input with dropdown button">
    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{languages[lang]}}</button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li v-for="(name,key) in languages" :key="key" :value="key"><a class="dropdown-item" href="#" @click="load(key)">{{name}}</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default() {
        return {}
      }
    },
    defaultLang: {
      default() {
        return process.env.VUE_APP_DEFAULT_LANG
      }
    }
  },
  inject: ['languages'],
  data() {
    return {
      lang: null,
      translations: {}
    }
  },
  created() {
    this.lang = this.defaultLang

    if (this.content !== null && Object.keys(this.content).length > 0) {
      this.translations = this.content
      if (!this.translations[this.lang]) {
        this.lang = Object.keys(this.translations)[0]
      }
    }
  },
  methods: {
    load(lang) {
      this.lang = lang
    }
  }
}
</script>
