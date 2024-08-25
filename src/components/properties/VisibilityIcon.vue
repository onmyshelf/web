<template>
  <i
    :class="'bi-' + $visibilityLevels[level].icon + ' me-3'"
    :data-visibility-level="level"
    :title="$t('Visibility') + ': ' + $t('Visibility level ' + $visibilityLevels[level].label)"
  />
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
