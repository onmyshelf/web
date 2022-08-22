import axios from "axios"

export default {
  install: (app) => {
    app.config.globalProperties.$apiConfig = (options = {}) => {
      let token = localStorage.getItem("onmyshelf_token")
      if (token) {
        options.headers = { Authorization: "Bearer " + token }
      }
      return options
    }

    app.config.globalProperties.$apiDelete = (url, options = {}) => {
      return axios.delete(
        import.meta.env.VITE_API_URL + "/" + url,
        app.config.globalProperties.$apiConfig(options)
      )
    }

    app.config.globalProperties.$apiGet = (url, options = {}) => {
      return axios.get(
        import.meta.env.VITE_API_URL + "/" + url,
        app.config.globalProperties.$apiConfig(options)
      )
    }

    app.config.globalProperties.$apiPatch = (url, data, options = {}) => {
      return axios.patch(
        import.meta.env.VITE_API_URL + "/" + url,
        data,
        app.config.globalProperties.$apiConfig(options)
      )
    }

    app.config.globalProperties.$apiPost = (url, data, options = {}) => {
      return axios.post(
        import.meta.env.VITE_API_URL + "/" + url,
        data,
        app.config.globalProperties.$apiConfig(options)
      )
    }

    app.config.globalProperties.$isLoggedIn = () => {
      return localStorage.getItem("onmyshelf_token") !== null
    }

    app.config.globalProperties.$currentUser = () => {
      return {
        id: localStorage.getItem("onmyshelf_userID"),
        username: localStorage.getItem("onmyshelf_username"),
      }
    }

    app.config.globalProperties.$matchUserId = (id) => {
      if (!localStorage.getItem("onmyshelf_userID")) {
        return false
      }
      return localStorage.getItem("onmyshelf_userID") == id
    }

    app.config.globalProperties.$demoMode = () => {
      return localStorage.getItem("onmyshelf_readonly") == "true"
    }

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
