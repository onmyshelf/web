<template>
  <template v-if="typeof this.text == 'string'">{{ text }}</template>
  <template v-else-if="text[$currentLanguage]">{{ text[$currentLanguage] }}</template>
  <template v-else>{{ text[Object.keys(text)[0]] }}</template>
</template>

<script>
export default {
  props: {
    text: {
      required: true,
    },
  },
}
</script>
