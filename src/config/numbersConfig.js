export const numbersConfig = {
    name: "numbers",
    tiles: [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type: "letter",
          label: ".",
          action: { type: "enter_letter", value: "." }
        },
        {
          type : "switch",
          label : "Back",
          action : { type: "switch_view", view : "writing"}
        },
        {
          type: "letter",
          label: "1",
          action: { type: "enter_letter", value: "1" }
        },
        {
          type: "letter",
          label: "2",
          action: { type: "enter_letter", value: "2" }
        },
        {
          type: "letter",
          label: "3",
          action: { type: "enter_letter", value: "3" }
        },
        {
          type: "letter",
          label: "4",
          action: { type: "enter_letter", value: "4" }
        },
        {
          type: "letter",
          label: "5",
          action: { type: "enter_letter", value: "5" }
        },
        {
          type: "switch",
          label: "67890",
          action: { type: "switch_view", view: "67890_menu" }
        },
        {
          type : "empty",
          label : ""
        },
        {
          type : "empty",
          label : ""
        }
      ]
  };