export const writing_submenuConfig = {
    name: "writing_submenu",
    tiles: [
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "letter",
          label: ".",
          action: { type: "enter_letter", value: "." }
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_view", layout: "main_menu" }
        },
        {
          type: "switch",
          label: "ABCDEFGH",
          action: { type: "switch_view", layout: "ABCDEFGH_menu" }
        },
        {
          type: "switch",
          label: "IJKLMNOP",
          action: { type: "switch_view", layout: "IJKLMNOP_menu" }
        },
        {
          type: "switch",
          label: "QRSTUVWX",
          action: { type: "switch_view", layout: "QRSTUVWX_menu" }
        },
        {
          type: "switch",
          label: "YZÆØÅ,?.._",
          action: { type: "switch_view", layout: "YZÆØÅ,?.._menu" }
        },
        {
          type: "switch",
          label: "0-9",
          action: { type: "switch_view", layout: "numbers" }
        },
        {
          type: "toggle_case",
          label: "CAPS",
          action: { type: "toggle_case" }
        },
        {
          type: "switch",
          label: "Navigation",
          action: { type: "switch_view", layout: "navigation_menu" }
        },
        {
          type : "switch",
          label : "Edit",
          action : { type : "switch_view", layout : "edit_menu"}
        }
      ]
  };