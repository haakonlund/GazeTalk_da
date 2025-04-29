export const main_menuConfig = {
    name: "main_menu",
    tiles: [
        
        {
          type: "switch",
          label: "write",
          action: { type: "switch_view", view: "writing" }
        },
        {
          type: "switch",
          label: "settings",
          action: { type: "switch_view", view: "edit_settings" }
        },
        {
          type: "switch",
          label: "play alarm",
          action: { type: "play_alarm" }
        },
        {
          type: "switch",
          label: "Pause",
          action :{type :"toggle_pause" }
        },
        {
          type: "switch",
          label: "Developer menu",
          action: { type: "switch_view", view: "development_menu" }
        },

        
      ]
  };