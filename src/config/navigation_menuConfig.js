export const navigation_menuConfig = {
    name : "navigation_menu",
    tiles : [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type : "switch",
          label : "Edit",
          action : { type : "switch_view", layout : "edit_menu"}
        },
        {
          type : "switch",
          label : "Back",
          action : { type: "switch_view", layout : "writing"}
        },
        {
          type : "cursor",
          label : "cursor to the left",
          action : { type: "cursor", direction : "left"}
        },
        {
          type : "cursor",
          label : "cursor to the right",
          action : { type: "cursor", direction : "right"}
        },
        {
          type : "cursor",
          label : "cursor up",
          action : { type: "cursor", direction : "up"}
        },
        {
          type : "switch",
          label : "More functions",
          action:  {type : "switch_view", layout : "more_function_menu"}
        },
        {
          type: "newline",
          label : "newline",
          action : { type: "newline", value: "\n"}
        },
        {
          type : "empty",
          label : "",
        },
        {
          type : "cursor",
          label : "cursor down",
          action : { type: "cursor", direction : "down"}
        },
        {
          label : "File",
        }
      ]
  };