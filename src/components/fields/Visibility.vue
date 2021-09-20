<template>
  <a :title="'Visibility: '+visibilityLevels[level].label">
    <i :class="'bi-'+visibilityLevels[level].icon"></i>
  </a>
</template>

<script>
export default {
  props: {
    level: {
      required: true
    }
  },
  inject: ['visibilityLevels']
}
</script>
