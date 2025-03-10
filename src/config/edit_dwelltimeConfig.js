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
          action: { type: "switch_view", view: "main_menu" }
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