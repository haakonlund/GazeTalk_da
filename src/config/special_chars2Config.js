export const special_chars2Config = {
    name: "\'\"%@;!*",
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
          action: { type: "switch_layout", layout: "YZÆØÅ,?.._menu" }
        },
        {
          type: "letter",
          label: "\'",
          action: { type: "enter_letter", value: "\'" }
        },
        {
          type: "letter",
          label: "\"",
          action: { type: "enter_letter", value: "\"" }
        },
        {
          type: "letter",
          label: "%",
          action: { type: "enter_letter", value: "%" }
        },
        {
          type: "letter",
          label: "@",
          action: { type: "enter_letter", value: "@" }
        },
        {
          type: "letter",
          label: ";",
          action: { type: "enter_letter", value: ";" }
        },
        {
          type: "letter",
          label: "!",
          action: { type: "enter_letter", value: "!" }
        },
        {
          type: "letter",
          label: "*",
          action: { type: "enter_letter", value: "*" }
        },
        {
          type: "switch",
          label: "More9870",
          action: { type: "switch_layout", layout: "$£€#_\\_menu" }
        }
      ]
  };