<template>
  <div v-if="$demoMode() && !$isLoggedIn()" class="alert alert-info" role="alert">
      <p>{{ $t("Demo mode. Log in with the following:") }}</p>
      <ul>
        <li>{{ $t("Username") }}: <strong>onmyshelf</strong></li>
        <li>{{ $t("Password") }}: <strong>onmyshelf</strong></li>
      </ul>
      {{ $t("In demo mode, you can't make any changes.") }}
    </div>
</template>