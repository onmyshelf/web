<template>
  <template v-if="Array.isArray(obj)">
    <Json v-for="value in obj" :key="value" :obj="value" />
  </template>
  <ul v-else>
    <li v-for="(value, key) of obj" :key=key>
      <template v-if="Array.isArray(value)">
        {{ key }}:
        <ul>
          <li v-for="v in value" :key="v">{{ v }}</li>
        </ul>
      </template>
      <template v-else-if="typeof value == 'object'">
        {{ key }}: <Json :obj="value" />
      </template>
      <template v-else>{{ key }}: {{ value }}</template>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    obj: {
      required: true,
    },
  },
}
</script>
