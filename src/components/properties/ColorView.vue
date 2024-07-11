<template>
  <div 
    :style="'background:' + value"
    class="property-color-view"
    :data-color-value="value"
  ></div>
</template>

<style scoped>
.property-color-view {
  display: block;
  border-radius: 100%;
  font-size: 1.6em;
  width: 1.6em;
  height: 1.6em;
  line-height: 1.6em;
  text-align: center;
  box-shadow: 0 0 0 1px #dee0e3;
  cursor: default;
}
</style>

<script>
export default {
  props: {
    value: {
      required: true,
    },
  },
}
</script>
