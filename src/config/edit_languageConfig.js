export const edit_languageConfig = {
    name: "edit_language",
    tiles: [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type: "switch",
          label: "Back",
          action: { type: "switch_view", view: "main_menu" }
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
        }
        
      ]
  };