export default {
  install: (app) => {
    app.config.globalProperties.$apiConfig = (options={}) => {
      let token = localStorage.getItem('onmyshelf_token')
      if (token) {
        options.headers = { 'Authorization': 'Bearer ' + token }
      }
      return options
    }

    app.config.globalProperties.$isLoggedIn = () => {
      return localStorage.getItem('onmyshelf_token') !== null
    }

    app.config.globalProperties.$currentToken = () => {
      return localStorage.getItem('onmyshelf_token')
    }

    app.config.globalProperties.$currentUserId = () => {
      return localStorage.getItem('onmyshelf_userID')
    }

    app.config.globalProperties.$matchUserId = (id) => {
      if (!localStorage.getItem('onmyshelf_userID')) {
        return false
      }
      return localStorage.getItem('onmyshelf_userID') == id
    }

    app.config.globalProperties.$cleanSession = () => {
      localStorage.removeItem('onmyshelf_token')
      localStorage.removeItem('onmyshelf_userID')
    }

    // check if a URL is a media path
    app.config.globalProperties.$isMediaUrl = (url) => {
      if (!url) {
        return false
      }
      return url.match(/^media:\/\//)
    }

    // transform URL if needed
    app.config.globalProperties.$mediaUrl = (url) => {
      if (!url) {
        return ''
      }
      const regex = /^media:\/\//
      if (url.match(regex)) {
        return url.replace(regex, import.meta.env.VITE_MEDIA_URL+'/')
      } else {
        return url
      }
    }
  }
}
