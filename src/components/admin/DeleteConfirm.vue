<template>
  <div class="container delete-confirm">
    <h5>
      {{ $t("Confirm delete " + obj) }} <span class="object-id">{{ id }}</span> ?
    </h5>

    <p v-if="consequences">{{ $t("Delete " + obj + " consequences") }}</p>

    <p>{{ $t("Operation cannot be undone") }}</p>

    <button
      type="button"
      id="deleteButton"
      class="btn btn-danger"
      @click="$parent[action]"
      :disabled="$demoMode()"
    >
      {{ $t("Delete " + obj) }}
    </button>
    &nbsp;
    <a href="." id="cancelButton" class="btn btn-outline-secondary">
      {{ $t("Cancel") }}
    </a>
  </div>
</template>

<style scoped>
.delete-confirm {
  text-align: center;
  margin-top: 100px;
}

.object-id {
  font-weight: bold;
  font-style: italic;
}
</style>

<script>
export default {
  props: {
    obj: {
      required: true,
    },
    id: {
      required: true,
    },
    action: {
      required: true,
    },
    consequences: {
      default: false,
    }
  },
}
</script>
