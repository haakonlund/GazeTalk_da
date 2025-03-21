export const main_menuConfig = {
    name: "main_menu",
    tiles: [
        // Row 1 (4 tiles): first two tiles combined into a textarea
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
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
        // Row 2 (4 tiles)
        {
          type: "switch",
          label: "play alarm",
          action: { type: "play_alarm" }
        },
        {
          type: "switch",
          label: "Test Tracker",
          action :{type :"switch_layout", value : "tracker" }
        },
        {
          type: "switch",
          label: "Pause",
          action :{type :"switch_view", view : "pause" }
        },
        {
          type: "switch",
          label: "Start Test",
          action :{type :"switch_view", view : "test" }
        }
      ]
  };