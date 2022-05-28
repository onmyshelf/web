export default {
  install: (app) => {
    // extract text from a translation object
    app.config.globalProperties.$translate = (obj) => {
      if (typeof(obj) != 'object') {
        return obj
      }

      // if lang exists, use it
      if (obj[import.meta.env.VITE_DEFAULT_LANG]) {
        return obj[import.meta.env.VITE_DEFAULT_LANG]
      } else {
        // else return the first key
        return obj[Object.keys(obj)[0]]
      }
    }

    // transform a string to a translation object
    app.config.globalProperties.$i18nObject = (text) => {
      return { [import.meta.env.VITE_DEFAULT_LANG]: text }
    }
  }
}
