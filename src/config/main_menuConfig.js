export const main_menuConfig = {
    name: "main_menu",
    tiles: [
        {
          type: "switch",
          label: "write",
          action: { type: "switch_view", view: "writing" }
        },
        {
          type: "switch",
          label: "settings",
          action: { type: "switch_view", view: "edit_settings" }
        },
        // Row 2 (4 tiles)
        {
          type: "switch",
          label: "play alarm",
          action: { type: "play_alarm" }
        },
        {
          type: "switch",
          label: "Test Tracker",
          action :{type :"switch_layout", value : "tracker" }
        },
        {
          type: "switch",
          label: "Pause",
          action :{type :"toggle_pause" }
        },
        {
          type: "switch",
          label: "Start Test",
          action :{type :"switch_view", view : "test" }
        },
        {
          type: "switch",
          label: "Test Mesurment",
          action :{type :"switch_layout", value : "mesurement" }
        },
        {
          type: "switch",
          label: "Start Test sutie",
          action: { type: "start_test_suite", value: "test_suite" }
        }
      ]
  };