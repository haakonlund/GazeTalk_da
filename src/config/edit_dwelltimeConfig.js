export const edit_dwelltimeConfig = {
    name: "edit_dwelltime",
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
        label: "back",
        action: { type: "switch_view", view: "main_menu" }
      },
      {
        type : "empty",
        label : "",
          
      },
      {
          type : "increase_dwelltime",
          label: "increase dwelltime",
          action : {type : "increase_dwelltime"}
      },
      {
        type : "empty",
        label : "",
      },
      {
        type : "empty",
        label : "",
          
      },
      {
        type : "empty",
        label : "",
          
      },
      {
          type : "decrease_dwelltime",
          label: "decrease dwelltime",
          action : {type : "decrease_dwelltime"}  
      },
      {
        type : "empty",
        label : "",
      },
      {
        type : "empty",
        label : "",
      }
    ]
  };