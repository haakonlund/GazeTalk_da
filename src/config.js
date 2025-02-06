import { act } from "react";

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
          type: "delete",
          label: "DELETE",
          action: { type: "delete_letter" }
        },
        {
          type: "switch",
          label: "ABC",
          action: { type: "switch_layout", layout: "writing_submenu" }
        },
        {
          type: "letter",
          label: "A",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          action: { type: "enter_letter", value: "A" }
        },
        {
          type: "letter",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          label: "B",
          action: { type: "enter_letter", value: "B" }
        },
        // Row 2 (4 tiles)
        {
          type: "letter",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          label: "C",
          action: { type: "enter_letter", value: "C" }
        },
        {
          type: "letter",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          label: "D",
          action: { type: "enter_letter", value: "D" }
        },
        {
          type: "letter",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
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
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          label: "F",
          action: { type: "enter_letter", value: "F" }
        },
        {
          type: "letter",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          label: "G",
          action: { type: "enter_letter", value: "G" }
        },
        {
          type: "letter",
          surroundingLetters: ['m', 'g', 'p', 'k', 'v', 'r'],
          label: "H",
          action: { type: "enter_letter", value: "H" }
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
          type: "letter",
          label: ".",
          action: { type: "enter_letter", value: "." }
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_layout", layout: "main_menu" }
        },
        {
          type: "switch",
          label: "ABCDEFGH",
          action: { type: "switch_layout", layout: "ABCDEFGH_menu" }
        },
        {
          type: "switch",
          label: "IJKLMNOP",
          action: { type: "switch_layout", layout: "IJKLMNOP_menu" }
        },
        {
          type: "switch",
          label: "QRSTUVWX",
          action: { type: "switch_layout", layout: "QRSTUVWX_menu" }
        },
        {
          type: "switch",
          label: "YZÆØÅ,?.._",
          action: { type: "switch_layout", layout: "YZÆØÅ,?.._menu" }
        },
        {
          type: "switch",
          label: "0-9",
          action: { type: "switch_layout", layout: "numbers" }
        },
        {
          type: "toggle_case",
          label: "CAPS",
          action: { type: "toggle_case" }
        },
        {
          type: "switch",
          label: "Navigation",
          action: { type: "switch_layout", layout: "navigation_menu" }
        },
        {
          type : "switch",
          label : "Edit",
          action : { type : "switch_layout", layout : "edit_menu"}
        }

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
          label: ".",
          action: { type: "enter_letter", value: "." }
        },
        {
          type : "switch",
          label : "back",
          action : { type: "switch_layout", layout : "writing"}
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
          label: "67890",
          action: { type: "switch_layout", layout: "67890_menu" }
        },
        {
          type : "empty",
          label : ""
        },
        {
          type : "empty",
          label : ""
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
          action: { type: "change_language", value: "en" }          
        },
        {
          type: "switch",
          label: "danish",
          action: { type: "change_language", value: "da" }
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
    },
    "ABCDEFGH_menu": {
      tiles: [
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "letter",
          label: ".",
          action: { type: "enter_letter", value: "." }
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_layout", layout: "writing" }
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
        }
      ]
    },
    "IJKLMNOP_menu": {
      tiles: [
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "letter",
          label: ".",
          action: { type: "enter_letter", value: "." }
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_layout", layout: "writing" }
        },
        {
          type: "letter",
          label: "I",
          action: { type: "enter_letter", value: "I" }
        },
        {
          type: "letter",
          label: "J",
          action: { type: "enter_letter", value: "J" }
        },
        {
          type: "letter",
          label: "K",
          action: { type: "enter_letter", value: "K" }
        },
        {
          type: "letter",
          label: "L",
          action: { type: "enter_letter", value: "L" }
        },
        {
          type: "letter",
          label: "M",
          action: { type: "enter_letter", value: "M" }
        },
        {
          type: "letter",
          label: "N",
          action: { type: "enter_letter", value: "N" }
        },
        {
          type: "letter",
          label: "O",
          action: { type: "enter_letter", value: "O" }
        },
        {
          type: "letter",
          label: "P",
          action: { type: "enter_letter", value: "P" }
        }
      ]
    },
    "QRSTUVWX_menu": {
      tiles: [
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "letter",
          label: ".",
          action: { type: "enter_letter", value: "." }
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_layout", layout: "writing" }
        },
        {
          type: "letter",
          label: "Q",
          action: { type: "enter_letter", value: "Q" }
        },
        {
          type: "letter",
          label: "R",
          action: { type: "enter_letter", value: "R" }
        },
        {
          type: "letter",
          label: "S",
          action: { type: "enter_letter", value: "S" }
        },
        {
          type: "letter",
          label: "T",
          action: { type: "enter_letter", value: "T" }
        },
        {
          type: "letter",
          label: "U",
          action: { type: "enter_letter", value: "U" }
        },
        {
          type: "letter",
          label: "V",
          action: { type: "enter_letter", value: "V" }
        },
        {
          type: "letter",
          label: "W",
          action: { type: "enter_letter", value: "W" }
        },
        {
          type: "letter",
          label: "X",
          action: { type: "enter_letter", value: "X" }
        }
      ]
    },
    "YZÆØÅ,?.._menu": {
      tiles: [
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "letter",
          label: ".",
          action: { type: "enter_letter", value: "." }
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_layout", layout: "writing" }
        },
        {
          type: "letter",
          label: "Y",
          action: { type: "enter_letter", value: "Y" }
        },
        {
          type: "letter",
          label: "Z",
          action: { type: "enter_letter", value: "Z" }
        },
        {
          type: "letter",
          label: "Æ",
          action: { type: "enter_letter", value: "Æ" }
        },
        {
          type: "letter",
          label: "Ø",
          action: { type: "enter_letter", value: "Ø" }
        },
        {
          type: "letter",
          label: "Å",
          action: { type: "enter_letter", value: "Å" }
        },
        {
          type: "letter",
          label: ",",
          action: { type: "enter_letter", value: "," }
        },
        {
          type: "switch",
          label: "():?+./=",
          action: { type: "switch_layout", layout: "():?+./=_menu" }
        },
        {
          type: "switch",
          label: "More",
          action: { type: "switch_layout", layout: "\'\"%@;!*" }
        },
        
      ]
    },
    "():?+./=_menu": {
        tiles: [
          {
            type: "textarea",
            colspan: 2 // This tile spans 2 columns
          },
          {
            type: "letter",
            label: ".",
            action: { type: "enter_letter", value: "." }
          },
          {
            type: "switch",
            label: "back",
            action: { type: "switch_layout", layout: "YZÆØÅ,?.._menu" }
          },
          {
            type: "letter",
            label: "(",
            action: { type: "enter_letter", value: "(" }
          },
          {
            type: "letter",
            label: ")",
            action: { type: "enter_letter", value: ")" }
          },
          {
            type: "letter",
            label: ":",
            action: { type: "enter_letter", value: ":" }
          },
          {
            type: "letter",
            label: "?",
            action: { type: "enter_letter", value: "?" }
          },
          {
            type: "letter",
            label: "+",
            action: { type: "enter_letter", value: "+" }
          },
          {
            type: "letter",
            label: "/",
            action: { type: "enter_letter", value: "/" }
          },
          {
            type: "letter",
            label: "=",
            action: { type: "enter_letter", value: "=" }
          },
          {
            type: "letter",
            label: "_",
            action: { type: "enter_letter", value: "_" }
          }
        ]
    },
    "\'\"%@;!*": {
        tiles: [
          {
            type: "textarea",
            colspan: 2 // This tile spans 2 columns
          },
          {
            type: "letter",
            label: ".",
            action: { type: "enter_letter", value: "." }
          },
          {
            type: "switch",
            label: "back",
            action: { type: "switch_layout", layout: "YZÆØÅ,?.._menu" }
          },
          {
            type: "letter",
            label: "\'",
            action: { type: "enter_letter", value: "\'" }
          },
          {
            type: "letter",
            label: "\"",
            action: { type: "enter_letter", value: "\"" }
          },
          {
            type: "letter",
            label: "%",
            action: { type: "enter_letter", value: "%" }
          },
          {
            type: "letter",
            label: "@",
            action: { type: "enter_letter", value: "@" }
          },
          {
            type: "letter",
            label: ";",
            action: { type: "enter_letter", value: ";" }
          },
          {
            type: "letter",
            label: "!",
            action: { type: "enter_letter", value: "!" }
          },
          {
            type: "letter",
            label: "*",
            action: { type: "enter_letter", value: "*" }
          },
          {
            type: "switch",
            label: "More9870",
            action: { type: "switch_layout", layout: "$£€#_\\_menu" }
          }
        ]
    },
    "$£€#_\\_menu":{
        tiles: [
          {
            type: "textarea",
            colspan: 2 // This tile spans 2 columns
          },
          {
            type: "letter",
            label: ".",
            action: { type: "enter_letter", value: "." }
          },
          {
            type: "switch",
            label: "back",
            action: { type: "switch_layout", layout: "\'\"%@;!*" }
          },
          {
            type: "letter",
            label: "$",
            action: { type: "enter_letter", value: "$" }
          },
          {
            type: "letter",
            label: "£",
            action: { type: "enter_letter", value: "£" }
          },
          {
            type: "letter",
            label: "€",
            action: { type: "enter_letter", value: "€" }
          },
          {
            type:"empty",
            label: ""
          },
          {
            type: "letter",
            label: "#",
            action: { type: "enter_letter", value: "#" }
          },
          {
            type: "letter",
            label: "\\",
            action: { type: "enter_letter", value: "\\" }
          },
          {
            type: "letter",
            label: "_",
            action: { type: "enter_letter", value: "_" }
          },
          {
            type:"empty",
            label: ""
          },
      ]
    
    },
    "67890_menu": {
      tiles: [
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "letter",
          label: ".",
          action: { type: "enter_letter", value: "." }
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_layout", layout: "writing" }
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
          type: "letter",
          label: "9",
          action: { type: "enter_letter", value: "9" }
        },
        {
          type: "letter",
          label: "0",
          action: { type: "enter_letter", value: "0" }
        },
        {
          type: "empty",
          label: ""
        },
        {
          type: "empty",
          label: ""
        },
        {
          type: "empty",
          label: ""
        }
      ]
    },

    "navigation_menu" : {
      tiles : [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type : "switch",
          label : "Edit",
          action : { type : "switch_layout", layout : "edit_menu"}
        },
        {
          type : "switch",
          label : "Back",
          action : { type: "switch_layout", layout : "writing"}
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
          label : "More functions",
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
    },
    "edit_menu" : {
      tiles : [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type: "switch",
          label: "Navigation",
          action: { type: "switch_layout", layout: "navigation_menu" }
        },
        {
          type: "switch",
          label: "Back",
          action: { type: "switch_layout", layout: "writing" }

        },
        {
          type : "asdf",
          label : "Delete Section"
        },
        {
          type : "asdf",
          label : "Delete Line"
        },
        {
          type : "editing",
          label : "Delete Word",
          action : { type: "delete_word"}
        },
        {
          type : "asdf",
          label : "Delete Letter"
        },
        {
          type : "empty",
          label : ""
        },
        {
          type : "empty",
          label : ""
        },
        {
          type : "asdf",
          label : "Undo"
        },
        {
          type : "Switch",
          label : "File",
          action : { type: "switch_layout", layout: "file_menu"}
        },
      ]
    }
}
};