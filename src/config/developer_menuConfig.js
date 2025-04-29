export const development_menuConfig = {
    name: "development_menu",
    tiles: [
        {
            type: "switch",
            label: "Start Tests",
            action:  { type: "enter_form", value: "enter_form" }
        },
        {
          type: "switch",
          label: "Test Tracker",
          action :{type :"switch_layout", value : "tracker" }
        },
        {
          type: "switch",
          label: "Start Test",
          action :{type :"switch_view", view : "test" }
        },
        {
          type: "switch",
          label: "Test Measurement",
          action :{type :"switch_layout", value : "measurement" }
        },
        {
            type : "switch",
            label : "Back",
            action : {type : "switch_view", view : "main_menu" }
        }
        
      ]
  };