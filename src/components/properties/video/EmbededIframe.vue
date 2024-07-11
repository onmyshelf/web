<template>
  <iframe
    :src="url"
    title="Video player"
    width="640"
    height="360"
    frameborder="0"
    allowfullscreen
  ></iframe>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
}
</script>
