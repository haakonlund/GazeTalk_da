export const first_pageConfig = {
    name: "first_page",
    tiles: [
        // Row 1 (4 tiles): first two tiles combined into a textarea
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "switch",
          label: "Start Tests",
          action: { type: "enter_form", value: "enter_form" }
        },
        {
          type: "Download Data",
          label: "Download Data",
          action: { type: "download_data" }
        },
        {
            type : "switch",
            label : "menu",
            action : { type : "switch_view", view : "main_menu" }
        }
      ]
  };