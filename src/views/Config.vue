<template>
  <main class="container">
    <h1>{{ $t("Server configuration") }}</h1>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a
          :href="($route.path == '/config' ? '#' : '/config')"
          :class="'nav-link ' + ($route.path == '/config' ? 'active' : '')"
          aria-current="page"
        >
          {{ $t("Server configuration") }}
        </a>
      </li>
      <li class="nav-item">
        <a
          href="/config/users/"
          :class="'nav-link ' + ($route.path.startsWith('/config/users/') ? 'active' : '')"
          aria-current="page"
        >
          {{ $t("Users") }}
        </a>
      </li>
      <li class="nav-item">
        <a
          href="/config/emails/"
          :class="'nav-link ' + ($route.path.startsWith('/config/emails/') ? 'active' : '')"
          aria-current="page"
        >
          {{ $t("Emails") }}
        </a>
      </li>
      <li class="nav-item">
        <a
          href="/config/modules/"
          :class="'nav-link ' + ($route.path.startsWith('/config/modules/') ? 'active' : '')"
          aria-current="page"
        >
          {{ $t("Modules") }}
        </a>
      </li>
    </ul>
    <div class="mt-3">
      <router-view></router-view>
    </div>
  </main>
</template>
