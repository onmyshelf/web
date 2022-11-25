<template>
  <div class="home">
    <div class="container">
      <DemoWarning />
      <Collections />
    </div>
  </div>
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
