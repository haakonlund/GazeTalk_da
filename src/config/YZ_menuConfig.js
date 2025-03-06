export const YZ_menuConfig = {
    name: "YZÆØÅ,?.._menu",
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
          action: { type: "switch_view", layout: "writing" }
        },
        {
          type: "letter",
          label: "Y",
          action: { type: "enter_letter", value: "Y" }
        },
        {
          type: "letter",
          label: "Z",
          action: { type: "enter_letter", value: "Z" }
        },
        {
          type: "letter",
          label: "Æ",
          action: { type: "enter_letter", value: "Æ" }
        },
        {
          type: "letter",
          label: "Ø",
          action: { type: "enter_letter", value: "Ø" }
        },
        {
          type: "letter",
          label: "Å",
          action: { type: "enter_letter", value: "Å" }
        },
        {
          type: "letter",
          label: ",",
          action: { type: "enter_letter", value: "," }
        },
        {
          type: "switch",
          label: "():?+./=",
          action: { type: "switch_view", layout: "():?+./=_menu" }
        },
        {
          type: "switch",
          label: "More",
          action: { type: "switch_view", layout: "%@;!*" }
        },
      ]
  };