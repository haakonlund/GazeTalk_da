export const more_function_menuConfig = {
    name: "more_function_menu",
    tiles : [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type : "switch",
          label : "Edit",
          action : {type : "switch_layout", layout : "edit_menu"}
        },
        {
          type : "switch",
          label: "back to writing",
          action : {type: "swtich_layout", layout : "writing"}
        },
        {
          type : "start_of_text",
          label : "Start of text",
          action : {type : "start_of_text"}
        },
        {
          type : "previous_section",
          label : "Previous section",
          action : {type : "previous_section"}
        },
        {
          type : "previous_sentence",
          label : "Previous sentence",
          action : {type : "previous_sentence"}
        },
        {
          type : "previous_word",
          label : "Previous word",
          action : {type : "previous_word"}
        },
        {
          type : "end_of_text",
          label : "End of text",
          action : {type : "end_of_text"}
        },
        {
          type : "next_section",
          label : "Next section",
          action : {type : "next_section"}
        },
        {
          type : "next_sentence",
          label : "Next Sentence",
          action : {type : "next_sentence"}

        },
        {
          type : "next_word",
          label : "next word",
          action : {type : "next_word"}
        },
      ]
  };