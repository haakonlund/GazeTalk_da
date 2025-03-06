export const special_chars3Config = {
    name: "$£€#__menu",
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
          action: { type: "switch_view", layout: "%@;!*" }
        },
        {
          type: "letter",
          label: "$",
          action: { type: "enter_letter", value: "$" }
        },
        {
          type: "letter",
          label: "£",
          action: { type: "enter_letter", value: "£" }
        },
        {
          type: "letter",
          label: "€",
          action: { type: "enter_letter", value: "€" }
        },
        {
          type:"empty",
          label: ""
        },
        {
          type: "letter",
          label: "#",
          action: { type: "enter_letter", value: "#" }
        },
        {
          type: "letter",
          label: "\\",
          action: { type: "enter_letter", value: "\\" }
        },
        {
          type: "letter",
          label: "_",
          action: { type: "enter_letter", value: "_" }
        },
        {
          type:"empty",
          label: ""
        },
    ]
  };