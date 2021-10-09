<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container container-fluid">
        <a class="navbar-brand" href="#">
          OnMyShelf
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse d-flex" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto">
            <li class="nav-item active">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link">About</router-link>
            </li>
          </ul>
        </div><!-- .navbar-collapse -->

        <ul class="navbar-nav me-auto">
          <template v-if="isLoggedIn">
            <li class="nav-item">
              <router-link to="/profile" class="nav-link">My profile</router-link>
            </li>
            <li class="nav-item">
              <a @click="logout" href="#" class="nav-link">Logout</a>
            </li>
          </template>
          <li v-else class="nav-item">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
        </ul>
      </div><!-- .container -->
    </nav>
  </header>
  <router-view/>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  provide() {
    return {
      languages: {
        'en_US': 'English',
        'fr_FR': 'Français',
        'de_GE': 'Deutsch'
      },
      propertyTypes: {
        text: {
          label: 'Text',
          description: 'used in most cases'
        },
        image: {
          label: 'Image'
        },
        video: {
          label: 'Video'
        },
        number: {
          label: 'Number'
        },
        date: {
          label: 'Date'
        },
        rating: {
          label: 'Rating'
        },
        yesno: {
          label: 'Yes or No',
          description: 'e.g. object is new'
        },
        longtext: {
          label: 'Long text',
          description: 'used for descriptions, comments, ...'
        },
        datetime: {
          label: 'Date and time'
        },
        url: {
          label: 'Link'
        },
        file: {
          label: 'File URI'
        },
        json: {
          label: 'JSON object',
          description: 'for advanced properties'
        }
      },
      visibilityLevels: {
        0: {
          label: 'Everyone',
          icon: 'globe'
        },
        1: {
          label: 'Logged in users',
          icon: 'unlock'
        },
        /* TODO
        2: {
          label: 'Shared users (not yet implemented)',
          icon: 'lock'
        },
        */
        3: {
          label: 'Only me',
          icon: 'person-circle'
        },
        4: {
          label: 'Nobody (hidden)',
          icon: 'eye-slash-fill'
        }
      }
    }
  },
  data() {
    return {
      isLoggedIn: false
    }
  },
  created() {
    this.isLoggedIn = this.$isLoggedIn()
  },
  methods: {
    logout() {
      // API config
      let apiConfig = this.$apiConfig()

      // clean local storage
      this.$cleanSession()

      // tell API to delete token
      axios.delete(process.env.VUE_APP_API_URL + '/token', apiConfig)
      .then(() => {
        document.location.href = '/'
      })
    }
  }
}
</script>
