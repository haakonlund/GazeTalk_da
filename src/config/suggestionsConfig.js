export const suggestionsConfig = {
    name: "suggestions",
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
          label: "back",
          action: { type: "switch_view", layout: "writing" }
        }
      ]
  };