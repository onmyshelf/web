<template>
  <main class="container">
    <DemoWarning v-if="$demoMode() && !$isLoggedIn()" />
    <Collections />
  </main>
</template>

<script>
import Collections from "@/components/Collections.vue"
import DemoWarning from "@/components/DemoWarning.vue"

export default {
  components: {
    Collections,
    DemoWarning,
  },
}
</script>
