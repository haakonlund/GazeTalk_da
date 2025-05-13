export const edit_settingsConfig = {
    name: "edit_settings",
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
          label: "layout",
          action: { type: "switch_view", view: "layouts" }
        },
        // {
        //   type: "switch",
        //   label: "dwell time",
        //   action: { type: "switch_view", view: "edit_dwelltime" }
        // },
        {
          type: "switch",
          label: "change language",
          action: { type: "switch_view", view: "edit_language" }
        },
        {
          type : "switch",
          label : "font size",
          action : {type : "switch_view", view : "adjust_font_size"}
        }
      ]
  };