<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
      <template v-if="parents.length > 0">
        <li v-for="parent in parents" :key=parent class="breadcrumb-item">
          <router-link :to="parent.url">{{parent.label}}</router-link>
        </li>
      </template>
      <li class="breadcrumb-item active" aria-current="page">{{current}}</li>
    </ol>
  </nav>
</template>

<script>
export default {
  props: {
    parents: {
      default() {
        return []
      }
    },
    current: {
      type: String,
      required: true
    }
  }
}
</script>
