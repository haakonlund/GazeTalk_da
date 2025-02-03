export const config = {
  layouts: {
    "writing": {
      tiles: [
        // Row 1 (4 tiles): first two tiles combined into a textarea
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "letter",
          label: "A",
          action: { type: "enter_letter", value: "A" }
        },
        {
          type: "letter",
          label: "B",
          action: { type: "enter_letter", value: "B" }
        },
        // Row 2 (4 tiles)
        {
          type: "letter",
          label: "C",
          action: { type: "enter_letter", value: "C" }
        },
        {
          type: "letter",
          label: "D",
          action: { type: "enter_letter", value: "D" }
        },
        {
          type: "letter",
          label: "E",
          action: { type: "enter_letter", value: "E" }
        },
        {
          type: "switch",
          label: "123",
          action: { type: "switch_layout", layout: "numbers" }
        },
        // Row 3 (4 tiles)
        {
          type: "letter",
          label: "F",
          action: { type: "enter_letter", value: "F" }
        },
        {
          type: "letter",
          label: "G",
          action: { type: "enter_letter", value: "G" }
        },
        {
          type: "letter",
          label: "H",
          action: { type: "enter_letter", value: "H" }
        },
        {
          type: "switch",
          label: "ABC",
          action: { type: "switch_layout", layout: "writing_submenu" }
        }
      ]
    },
    "writing_submenu": {
      tiles: [
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_layout", layout: "main_menu" }
        },
        {
          type: "letter",
          label: "J",
          action: { type: "enter_letter", value: "J" }
        },

      ]

    },
    "numbers": {
      tiles: [
        {
          type: "textarea",
          colspan: 2
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
          label: "ABC",
          action: { type: "switch_layout", layout: "default" }
        },
        {
          type: "letter",
          label: "6",
          action: { type: "enter_letter", value: "6" }
        },
        {
          type: "letter",
          label: "7",
          action: { type: "enter_letter", value: "7" }
        },
        {
          type: "letter",
          label: "8",
          action: { type: "enter_letter", value: "8" }
        },
        {
          type: "switch",
          label: "ABC",
          action: { type: "switch_layout", layout: "default" }
        }
      ]
    },
    "main_menu": {
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
          type: "empty",
          label: "",
        },
        // Row 2 (4 tiles)
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
    }
  }
};