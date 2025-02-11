export const writingConfig = {
    name: "writing",
    tiles: [
        // Row 1 (4 tiles): first two tiles combined into a textarea
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "delete",
          label: "DELETE",
          action: { type: "delete_letter" }
        },
        {
          type: "switch",
          label: "ABCD...",
          action: { type: "switch_layout", layout: "writing_submenu" }
        },
        {
          type: "letter",
          label: "skrr",
          surroundingLetters: [],
          action: { type: "show_suggestions", value: "" }
        },
        {
          type: "letter",
          label: "A",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          action: { type: "enter_letter", value: "A" }
        },
        {
          type: "letter",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          label: "B",
          action: { type: "enter_letter", value: "B" }
        },
        // Row 2 (4 tiles)
        {
          type: "letter",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          label: "C",
          action: { type: "enter_letter", value: "C" }
        },
        {
          type: "letter",
          surroundingLetters: [],
          label: "Space",
          action: { type: "enter_letter", value: " " }
        },
        {
          type: "letter",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          label: "D",
          action: { type: "enter_letter", value: "D" }
        },
        {
          type: "letter",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          label: "E",
          action: { type: "enter_letter", value: "E" }
        },
        {
          type: "letter",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          label: "F",
          action: { type: "enter_letter", value: "F" }
        }
      ]
  };