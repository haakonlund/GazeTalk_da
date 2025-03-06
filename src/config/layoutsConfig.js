export const layoutsConfig = {
    name: "layouts",
    tiles: [
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type : "empty",
          label : "",  
        },
        {
          type: "switch",
          label: "back",
          action: { type: "", view: "main_menu" }
        },
        {
          type: "iconTile",
          icon: "4x3",
          action: { type: "switch_layout", value: "4x3" }
        },
        {
          type: "iconTile",
          icon: "/icons/3+3x3.png",
          action: { type: "switch_layout", value: "3+3x3" }
        }
      ]
  };