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
          action: { type: "switch_layout", layout: "writing" }
        },
        {
          type: "switch",
          label: "settings",
          action: { type: "switch_layout", layout: "edit_settings" }
        },
        // Row 2 (4 tiles)
        {
          type: "switch",
          label: "play alarm",
          action: { type: "play_alarm" }
        },
        {
          type: "empty",
          label: "",
        },
        {
          type: "empty",
          label: "",
        },
        {
          type: "empty",
          label: "",
        },
        // Row 3 (4 tiles)
        {
          type: "empty",
          label: "",
        },
        {
          type: "empty",
          label: "",
        },
        {
          type: "empty",
          label: "",
        },
        {
          type: "empty",
          label: "",
        },
      ]
  };