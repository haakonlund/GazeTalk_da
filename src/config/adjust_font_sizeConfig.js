export const adjust_font_sizeConfig = {
    name: "adjust_font_size",
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
            type : "decrease_button_font_size",
            label: "decrease button size",
            action : {type : "decrease_button_font_size"}
        },
        {
            type : "increase_button_font_size",
            label: "increase button size",
            action : {type : "increase_button_font_size"}
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
            type : "decrease_text_font_size",
            label: "decrease text size",
            action : {type : "decrease_text_font_size"}  
        },
        {
          type : "increase_text_font_size",
          label: "increase text size",
          action : {type : "increase_text_font_size"}
        },
        {
          type : "empty",
          label : "",
        }
      ]
  };