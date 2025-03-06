export const special_chars1Config = {
    name: "():?+./=_menu",
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
          action: { type: "switch_view", layout: "YZÆØÅ,?.._menu" }
        },
        {
          type: "letter",
          label: "(",
          action: { type: "enter_letter", value: "(" }
        },
        {
          type: "letter",
          label: ")",
          action: { type: "enter_letter", value: ")" }
        },
        {
          type: "letter",
          label: ":",
          action: { type: "enter_letter", value: ":" }
        },
        {
          type: "letter",
          label: "?",
          action: { type: "enter_letter", value: "?" }
        },
        {
          type: "letter",
          label: "+",
          action: { type: "enter_letter", value: "+" }
        },
        {
          type: "letter",
          label: "/",
          action: { type: "enter_letter", value: "/" }
        },
        {
          type: "letter",
          label: "=",
          action: { type: "enter_letter", value: "=" }
        },
        {
          type: "letter",
          label: "_",
          action: { type: "enter_letter", value: "_" }
        }
      ]
  };