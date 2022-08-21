import translations from "./translations.json"

export default {
  install: (app) => {
    app.config.globalProperties.$languages = {
      en_US: "English",
      fr_FR: "Français",
    }
    app.config.globalProperties.$currentLanguage = localStorage.getItem("onmyshelf_lang")

    // extract text from a translation object
    app.config.globalProperties.$translate = (obj) => {
      if (typeof obj != "object") {
        return obj
      }

      // if lang exists, use it
      if (obj[app.config.globalProperties.$currentLanguage]) {
        return obj[app.config.globalProperties.$currentLanguage]
      } else {
        // else return the first key
        return obj[Object.keys(obj)[0]]
      }
    }

    // transform a string to a translation object
    app.config.globalProperties.$i18nObject = (text) => {
      return {
        [app.config.globalProperties.$currentLanguage]: text
      }
    }

    // translate
    app.config.globalProperties.$t = (key) => {
      if (!translations[key]) {
        return key
      }
      return app.config.globalProperties.$translate(translations[key])
    }
  }
}
