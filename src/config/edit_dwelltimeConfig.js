export const edit_dwelltimeConfig = {
    name: "edit_dwelltime",
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
          action: { type: "change_dwell_time", value: "500" }
        },
        {
          type: "switch",
          label: "0,75 sekund",
          action: { type: "change_dwell_time", value: "600" }
        },
        {
          type: "switch",
          label: "1 sekund",
          action: { type: "change_dwell_time", value: "1000" }
        },
        {
          type: "switch",
          label: "1,25 sekunder",
          action: { type: "change_dwell_time", value: "1250" }
        },
        {
          type: "switch",
          label: "1,5 sekunder",
          action: { type: "change_dwell_time", value: "1500" }
        },
        {
          type: "switch",
          label: "1,75 sekunder",
          action: { type: "change_dwell_time", value: "1750" }
        },
        {
          type: "switch",
          label: "2 sekunder",
          action: { type: "change_dwell_time", value: "2000" }
        },
        {
          type: "switch",
          label: "2,5 sekunder",
          action: { type: "change_dwell_time", value: "2500" }
        },
        {
          type: "switch",
          label: "3 sekunder",
          action: { type: "change_dwell_time", value: "3000" }
        }
      ]
  };

export const edit_languageConfig = {
    name: "edit_language",
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
  };