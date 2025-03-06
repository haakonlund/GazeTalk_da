export const edit_settingsConfig = {
    name: "edit_settings",
    tiles: [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_view", layout: "main_menu" }
        },
        {
          type: "switch",
          label: "button layout",
          action: { type: "switch_view", layout: "edit_buttonlayout" }
        },
        {
          type: "switch",
          label: "dwell time",
          action: { type: "switch_view", layout: "edit_dwelltime" }
        },
        {
          type: "switch",
          label: "change language",
          action: { type: "switch_view", layout: "edit_language" }
        },
        {
          type : "switch",
          label : "font size",
          action : {type : "switch_view", layout : "adjust_font_size"}
        }
      ]
  };