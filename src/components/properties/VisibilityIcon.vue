<template>
  <a
    :title="$t('Visibility') + ': ' + $translate($visibilityLevels[level].label)"
    :data-visibility-level="level"
    class="me-3"
  >
    <i :class="'bi-' + $visibilityLevels[level].icon"></i>
  </a>
</template>

<script>
export default {
  props: {
    level: {
      required: true,
    },
  },
}
</script>
