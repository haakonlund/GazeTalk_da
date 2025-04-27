export const pauseConfig = {
    name: "pause",
    tiles: [
        {
          type: "textarea",
          colspan: 2
        },
        {
            type : "empty",
            label : "",
              
        },
        {
          type: "switch",
          label: "Back",
          action: { type: "switch_view", view: "main_menu" }
        }
      ]
  };