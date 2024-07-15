import axios from "axios"

export default {
  install: (app) => {
    // generate API headers for requests
    app.config.globalProperties.$apiConfig = (options = {}) => {
      // append default language
      let lang = localStorage.getItem("onmyshelf_lang")
      if (!lang) {
        lang = "en_US"
      }

      options.headers = { "Content-Language": lang }

      // append token if defined
      let token = localStorage.getItem("onmyshelf_token")
      if (token) {
        options.headers.Authorization = "Bearer " + token
      }
      return options
    }

    // send a DELETE request to the API
    app.config.globalProperties.$apiDelete = (url, options = {}) => {
      return axios.delete(
        import.meta.env.VITE_API_URL + "/" + url,
        app.config.globalProperties.$apiConfig(options)
      )
    }

    // send a GET request to the API
    app.config.globalProperties.$apiGet = (url, options = {}) => {
      return axios.get(
        import.meta.env.VITE_API_URL + "/" + url,
        app.config.globalProperties.$apiConfig(options)
      )
    }

    // send a PATCH request to the API
    app.config.globalProperties.$apiPatch = (url, data, options = {}) => {
      return axios.patch(
        import.meta.env.VITE_API_URL + "/" + url,
        data,
        app.config.globalProperties.$apiConfig(options)
      )
    }

    // send a POST request to the API
    app.config.globalProperties.$apiPost = (url, data, options = {}) => {
      return axios.post(
        import.meta.env.VITE_API_URL + "/" + url,
        data,
        app.config.globalProperties.$apiConfig(options)
      )
    }

    // manage API errors
    app.config.globalProperties.$apiErrorStatus = (error) => {
      if (!error.response) {
        return 500
      }

      let status = error.response.status
      switch (status) {
        case 404:
          return status

        default:
          return 500
      }
    }

    // check if user is logged in
    app.config.globalProperties.$isLoggedIn = () => {
      return localStorage.getItem("onmyshelf_token") !== null
    }

    // get current user data
    app.config.globalProperties.$currentUser = () => {
      return {
        id: localStorage.getItem("onmyshelf_userID"),
        username: localStorage.getItem("onmyshelf_username"),
      }
    }

    // test if user ID matches
    app.config.globalProperties.$matchUserId = (id) => {
      if (!localStorage.getItem("onmyshelf_userID")) {
        return false
      }
      return localStorage.getItem("onmyshelf_userID") == id
    }

    // test if running in demo mode
    app.config.globalProperties.$demoMode = () => {
      return localStorage.getItem("onmyshelf_readonly") == "true"
    }

    // clean user data session
    app.config.globalProperties.$cleanSession = () => {
      localStorage.removeItem("onmyshelf_token")
      localStorage.removeItem("onmyshelf_userID")
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
        return ""
      }
      const regex = /^media:\/\//
      if (url.match(regex)) {
        return url.replace(regex, import.meta.env.VITE_MEDIA_URL + "/")
      } else {
        return url
      }
    }
  },
}
