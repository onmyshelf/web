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
          en_US: "URI file://...",
          fr_FR: "lien file://...",
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
          en_US: "Nobody (hidden)",
          fr_FR: "Personne (caché)",
        },
        icon: "eye-slash-fill",
      },
    }
  },
}
