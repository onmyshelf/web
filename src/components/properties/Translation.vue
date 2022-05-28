<template>
  <template v-if="isString">{{text}}</template>
  <template v-else-if="text[defaultLanguage]">{{text[defaultLanguage]}}</template>
  <template v-else>{{text[Object.keys(text)[0]]}}</template>
</template>

<script>
export default {
  props: {
    text: {
      required: true
    }
  },
  computed: {
    isString() {
      return (typeof this.text == 'string')
    },
    defaultLanguage() {
      return import.meta.env.VITE_DEFAULT_LANG
    }
  }
}
</script>
