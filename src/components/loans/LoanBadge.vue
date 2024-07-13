<template>
  <span class="me-2">
    <span v-if="state == 'asked'" class="badge text-bg-warning">
      {{ $translate($loanStates[state].label) }}
    </span>
    <span v-else-if="state == 'rejected'" class="badge text-bg-secondary">
      {{ $translate($loanStates[state].label) }}
    </span>
    <span v-else-if="state == 'accepted'" class="badge text-bg-info">
      {{ $translate($loanStates[state].label) }}
    </span>
    <span v-else-if="state == 'lent'" class="badge text-bg-danger">
      {{ $translate($loanStates[state].label) }}
    </span>
    <span v-else-if="state == 'returned'" class="badge text-bg-success">
      {{ $translate($loanStates[state].label) }}
    </span>
  </span>
</template>

<script>
export default {
  props: {
    state: {
      type: String,
      required: true,
    },
  },
}
</script>
