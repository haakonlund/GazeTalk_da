export const Alphabet_V2Config = {
    name: "Alphabet_V2",
    tiles: [
        {
          type: "switch",
          label: "Back",
          action: { type: "switch_view", view: "writing" }
        },
        {
          type: "letter",
          label: ".",
          action: { type: "enter_letter", value: "." }
        },
        {
          type: "switch",
          label: "Menu",
          action: { type: "switch_view", view: "main_menu" }
        },
      ]
  };