export const config = {
  layouts: {
    "writing": {
      tiles: [
        // Row 1 (4 tiles): first two tiles combined into a textarea
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "letter",
          label: "A",
          action: { type: "enter_letter", value: "A" }
        },
        {
          type: "letter",
          label: "B",
          action: { type: "enter_letter", value: "B" }
        },
        // Row 2 (4 tiles)
        {
          type: "letter",
          label: "C",
          action: { type: "enter_letter", value: "C" }
        },
        {
          type: "letter",
          label: "D",
          action: { type: "enter_letter", value: "D" }
        },
        {
          type: "letter",
          label: "E",
          action: { type: "enter_letter", value: "E" }
        },
        {
          type: "switch",
          label: "123",
          action: { type: "switch_layout", layout: "numbers" }
        },
        // Row 3 (4 tiles)
        {
          type: "letter",
          label: "F",
          action: { type: "enter_letter", value: "F" }
        },
        {
          type: "letter",
          label: "G",
          action: { type: "enter_letter", value: "G" }
        },
        {
          type: "letter",
          label: "H",
          action: { type: "enter_letter", value: "H" }
        },
        {
          type: "switch",
          label: "ABC",
          action: { type: "switch_layout", layout: "writing_submenu" }
        }
      ]
    },
    "writing_submenu": {
      tiles: [
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_layout", layout: "main_menu" }
        },
        {
          type: "letter",
          label: "J",
          action: { type: "enter_letter", value: "J" }
        },

      ]

    },
    "numbers": {
      tiles: [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type: "letter",
          label: "1",
          action: { type: "enter_letter", value: "1" }
        },
        {
          type: "letter",
          label: "2",
          action: { type: "enter_letter", value: "2" }
        },
        {
          type: "letter",
          label: "3",
          action: { type: "enter_letter", value: "3" }
        },
        {
          type: "letter",
          label: "4",
          action: { type: "enter_letter", value: "4" }
        },
        {
          type: "letter",
          label: "5",
          action: { type: "enter_letter", value: "5" }
        },
        {
          type: "switch",
          label: "ABC",
          action: { type: "switch_layout", layout: "default" }
        },
        {
          type: "letter",
          label: "6",
          action: { type: "enter_letter", value: "6" }
        },
        {
          type: "letter",
          label: "7",
          action: { type: "enter_letter", value: "7" }
        },
        {
          type: "letter",
          label: "8",
          action: { type: "enter_letter", value: "8" }
        },
        {
          type: "switch",
          label: "ABC",
          action: { type: "switch_layout", layout: "default" }
        }
      ]
    },
    "edit_settings": {
      tiles: [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_layout", layout: "main_menu" }
        },
        {
          type: "switch",
          label: "button layout",
          action: { type: "switch_layout", layout: "edit_buttonlayout" }
        },
        {
          type: "switch",
          label: "linger time",
          action: { type: "switch_layout", layout: "edit_lingertime" }
        },
        {
          type: "switch",
          label: "change language",
          action: { type: "switch_layout", layout: "edit_language" }
        }
      ]
    },
    "edit_lingertime": {
      tiles: [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_layout", layout: "main_menu" }
        },
        {
          type: "switch",
          label: "0,5 sekunder",
          action: { type: "change_linger_time", value: "500" }
        },
        {
          type: "switch",
          label: "1 sekund",
          action: { type: "change_linger_time", value: "1000" }
        },
        {
          type: "switch",
          label: "1,5 sekund",
          action: { type: "change_linger_time", value: "1500" }
        },
        {
          type: "switch",
          label: "2 sekunder",
          action: { type: "change_linger_time", value: "2000" }
        },
        {
          type: "switch",
          label: "2,5 sekunder",
          action: { type: "change_linger_time", value: "2500" }
        },
        {
          type: "switch",
          label: "3 sekunder",
          action: { type: "change_linger_time", value: "3000" }
        },
        {
          type: "switch",
          label: "5 sekunder",
          action: { type: "change_linger_time", value: "5000" }
        },
        {
          type: "switch",
          label: "7,5 sekunder",
          action: { type: "change_linger_time", value: "7500" }
        },
        {
          type: "switch",
          label: "10 sekunder",
          action: { type: "change_linger_time", value: "1000" }
        }
      ]
    },
    "edit_language": {
      tiles: [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_layout", layout: "main_menu" }
        },
        {
          type: "switch",
          label: "swedish",
          action: { type: "change_language", value: "swedish" }
        },
        {
          type: "switch",
          label: "english",
          action: { type: "change_language", value: "english" }          
        },
        {
          type: "switch",
          label: "danish",
          action: { type: "change_language", value: "danish" }
        },
        {
          type: "switch",
          label: "norwegian",
          action: { type: "change_language", value: "norwegian" }
        },
        {
          type: "switch",
          label: "german",
          action: { type: "change_language", value: "german" }
        },
        {
          type: "switch",
          label: "french",
          action: { type: "change_language", value: "french" }
        },
        {
          type: "switch",
          label: "spanish",
          action: { type: "change_language", value: "spanish" }
        },
        {
          type: "switch",
          label: "italian",
          action: { type: "change_language", value: "italian" }
        },
        {
          type: "switch",
          label: "portuguese",
          action: { type: "change_language", value: "portuguese" }
        }
      ]
    },
    
    "edit_buttonlayout": {
      tiles: [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type: "switch",
          label: "2+4x2",
          action: { type: "choose_button_layout", value: "2+4x2" }
        },
        {
          type: "switch",
          label: "3x3",
          action: { type: "choose_button_layout", value: "3x3" }
        },
        {
          type: "switch",
          label: "2x4",
          action: { type: "choose_button_layout", value: "2x4" }
        },
        {
          type: "switch",
          label: "4x2",
          action: { type: "choose_button_layout", value: "4x2" }
        },
        {
          type: "switch",
          label: "2x3",
          action: { type: "choose_button_layout", value: "2x3" }
        },
        {
          type: "switch",
          label: "3x2",
          action: { type: "choose_button_layout", value: "3x2" }
        },
        {
          type: "switch",
          label: "5x3",
          action: { type: "choose_button_layout", value: "5x3" }
        },
        {
          type: "switch",
          label: "3x5",
          action: { type: "choose_button_layout", value: "3x5" }
        },
        {
          type: "switch",
          label: "4x5",
          action: { type: "choose_button_layout", value: "4x5" }
        },
        {
          type: "switch",
          label: "5x4",
          action: { type: "choose_button_layout", value: "5x4" }
        }
      ]
    },
    "main_menu": {
      tiles: [
        // Row 1 (4 tiles): first two tiles combined into a textarea
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "switch",
          label: "write",
          action: { type: "switch_layout", layout: "writing" }
        },
        {
          type: "switch",
          label: "settings",
          action: { type: "switch_layout", layout: "edit_settings" }
        },
        // Row 2 (4 tiles)
        {
          type: "empty",
          label: "",
        },
        {
          type: "empty",
          label: "",
        },
        {
          type: "empty",
          label: "",
        },
        {
          type: "empty",
          label: "",
        },
        // Row 3 (4 tiles)
        {
          type: "empty",
          label: "",
        },
        {
          type: "empty",
          label: "",
        },
        {
          type: "empty",
          label: "",
        },
        {
          type: "empty",
          label: "",
        },
      ]
    }
  }
};