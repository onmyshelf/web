export default {
  install: (app) => {
    app.config.globalProperties.$propertyTypes = {
      text: {
        label: {
          en_US: "Text",
          fr_FR: "Texte",
        },
        description: {
          en_US: "used in most cases",
          fr_FR: "utilisé dans la plupart des cas",
        },
      },
      image: {
        label: "Image",
      },
      video: {
        label: {
          en_US: "Video",
          fr_FR: "Vidéo",
        },
      },
      number: {
        label: {
          en_US: "Number",
          fr_FR: "Nombre",
        },
      },
      date: {
        label: "Date",
      },
      datetime: {
        label: {
          en_US: "Date and time",
          fr_FR: "Date et heure",
        },
      },
      rating: {
        label: {
          en_US: "Rating",
          fr_FR: "Notation",
        },
      },
      yesno: {
        label: {
          en_US: "Yes or No",
          fr_FR: "Oui ou Non",
        },
        description: {
          en_US: "e.g. object is new",
          fr_FR: "ex : l'objet est neuf",
        },
      },
      longtext: {
        label: {
          en_US: "Long text",
          fr_FR: "Texte long",
        },
        description: {
          en_US: "used for descriptions, comments, etc.",
          fr_FR: "utilisé pour les descriptions, commentaires, etc.",
        },
      },
      url: {
        label: "URL",
        description: {
          en_US: "link https://...",
          fr_FR: "lien https://...",
        },
      },
      file: {
        label: {
          en_US: "File",
          fr_FR: "Fichier",
        },
        description: {
          en_US: "PDF, DOC, ...",
        },
      },
      color: {
        label: {
          en_US: "Color",
          fr_FR: "Couleur",
        },
      },
      json: {
        label: {
          en_US: "JSON object",
          fr_FR: "Objet JSON",
        },
        description: {
          en_US: "for advanced properties",
          fr_FR: "pour propriétés avancées",
        },
      },
    }

    app.config.globalProperties.$loanStates = {
      asked: {
        label: {
          en_US: "Loan request",
          fr_FR: "Demande de prêt",
        },
      },
      rejected: {
        label: {
          en_US: "Loan rejected",
          fr_FR: "Prêt refusé",
        },
      },
      accepted: {
        label: {
          en_US: "Loan accepted",
          fr_FR: "Prêt accepté",
        },
      },
      lent: {
        label: {
          en_US: "Lent",
          fr_FR: "Prêté",
        },
      },
      returned: {
        label: {
          en_US: "Returned",
          fr_FR: "Rendu",
        },
      },
    }

    app.config.globalProperties.$visibilityLevels = {
      0: {
        label: {
          en_US: "Everyone",
          fr_FR: "Tout le monde",
        },
        icon: "globe",
      },
      1: {
        label: {
          en_US: "Logged in users",
          fr_FR: "Utilisateurs connectés",
        },
        icon: "unlock",
      },
      /* TODO
      2: {
        label: {
          en_US: "Shared users",
          fr_FR: "Utilisateurs partagés",
        },
        icon: "lock",
      },
      */
      3: {
        label: {
          en_US: "Only me",
          fr_FR: "Moi seulement",
        },
        icon: "person-circle",
      },
      4: {
        label: {
          en_US: "Nobody",
          fr_FR: "Personne",
        },
        icon: "eye-slash-fill",
      },
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

    app.config.globalProperties.$downloadFile = (filename, content) => {
      var element = document.createElement("a")

      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(content)
      )

      element.setAttribute("download", filename)
      element.style.display = "none"

      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    }
  },
}
