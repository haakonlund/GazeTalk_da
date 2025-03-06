export const viewsConfig = {
    name: "views",
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
          action: { type: "", layout: "main_menu" }
        },
        {
          type: "iconTile",
          icon: "",
          action: { type: "enter_letter", value: "." }
        }
      ]
  };