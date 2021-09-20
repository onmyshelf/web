export default {
  install: (app) => {
    // extract text from a translation object
    app.config.globalProperties.$translate = (obj) => {
      if (typeof(obj) != 'object') {
        return obj
      }

      // if lang exists, use it
      if (obj[process.env.VUE_APP_DEFAULT_LANG]) {
        return obj[process.env.VUE_APP_DEFAULT_LANG]
      } else {
        // else return the first key
        return obj[Object.keys(obj)[0]]
      }
    }

    // transform a string to a translation object
    app.config.globalProperties.$i18nObject = (text) => {
      return { [process.env.VUE_APP_DEFAULT_LANG]: text }
    }
  }
}
