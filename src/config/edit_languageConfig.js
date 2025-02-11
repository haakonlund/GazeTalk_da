export const edit_languageConfig = {
    name: "edit_language",
    tiles: [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_layout", layout: "main_menu" }
        },
        {
          type: "switch",
          label: "swedish",
          action: { type: "change_language", value: "swedish" }
        },
        {
          type: "switch",
          label: "english",
          action: { type: "change_language", value: "en" }          
        },
        {
          type: "switch",
          label: "danish",
          action: { type: "change_language", value: "da" }
        },
        {
          type: "switch",
          label: "norwegian",
          action: { type: "change_language", value: "norwegian" }
        },
        {
          type: "switch",
          label: "german",
          action: { type: "change_language", value: "german" }
        },
        {
          type: "switch",
          label: "french",
          action: { type: "change_language", value: "french" }
        },
        {
          type: "switch",
          label: "spanish",
          action: { type: "change_language", value: "spanish" }
        },
        {
          type: "switch",
          label: "italian",
          action: { type: "change_language", value: "italian" }
        },
        {
          type: "switch",
          label: "portuguese",
          action: { type: "change_language", value: "portuguese" }
        }
      ]
  };