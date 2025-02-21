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
          label: "",
          surroundingLetters: [],
          action: { type: "show_suggestions", value: "" }
        },
        // {
        //   type: "letter",
        //   label: "A",
        //   surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
        //   action: { type: "letter_suggestion", value: "A" }
        // },
        // {
        //   type: "letter",
        //   surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
        //   label: "B",
        //   action: { type: "letter_suggestion", value: "B" }
        // },
        // // Row 2 (4 tiles)
        // {
        //   type: "letter",
        //   surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
        //   label: "C",
        //   action: { type: "letter_suggestion", value: "C" }
        // },
        // {
        //   type: "letter",
        //   surroundingLetters: [],
        //   label: "Space",
        //   action: { type: "letter", value: " " }
        // },
        // {
        //   type: "letter",
        //   surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
        //   label: "D",
        //   action: { type: "letter_suggestion", value: "D" }
        // },
        // {
        //   type: "letter",
        //   surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
        //   label: "E",
        //   action: { type: "letter_suggestion", value: "E" }
        // },
        // {
        //   type: "letter",
        //   surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
        //   label: "F",
        //   action: { type: "letter_suggestion", value: "F" }
        // }
      ]
  };