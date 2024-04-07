<template>
  <Navbar />
  <router-view />
</template>

<script>
import Navbar from "@/components/Header.vue"

export default {
  name: "App",
  components: {
    Navbar,
  },
}
</script>
