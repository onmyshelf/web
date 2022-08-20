<template>
  <Header />
  <router-view />
</template>

<script>
import Header from "@/components/Header.vue"

export default {
  name: "App",
  provide() {
    return {
      languages: {
        en_US: "English",
        fr_FR: "Français",
      },
      propertyTypes: {
        text: {
          label: "Text",
          description: "used in most cases",
        },
        image: {
          label: "Image",
        },
        video: {
          label: "Video",
        },
        number: {
          label: "Number",
        },
        date: {
          label: "Date",
        },
        datetime: {
          label: "Date and time",
        },
        rating: {
          label: "Rating",
        },
        yesno: {
          label: "Yes or No",
          description: "e.g. object is new",
        },
        longtext: {
          label: "Long text",
          description: "used for descriptions, comments, ...",
        },
        url: {
          label: "URL (link)",
        },
        file: {
          label: "File URI",
        },
        color: {
          label: "Color",
        },
        json: {
          label: "JSON object",
          description: "for advanced properties",
        },
      },
      visibilityLevels: {
        0: {
          label: "Everyone",
          icon: "globe",
        },
        1: {
          label: "Logged in users",
          icon: "unlock",
        },
        /* TODO
        2: {
          label: "Shared users (not yet implemented)",
          icon: "lock",
        },
        */
        3: {
          label: "Only me",
          icon: "person-circle",
        },
        4: {
          label: "Nobody (hidden)",
          icon: "eye-slash-fill",
        },
      },
    }
  },
  components: {
    Header,
  },
}
</script>
