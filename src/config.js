import React from "react";
import { ABCDEFGH_menuConfig } from "./config/ABCDEFGH_menuConfig";
import { IJKLMNOP_menuConfig } from "./config/IJKLMNOP_menuConfig";
import { QRSTUVWX_menuConfig } from "./config/QRSTUVWX_menuConfig";
import { YZ_menuConfig } from "./config/YZ_menuConfig";
import { numbersConfig } from "./config/numbersConfig";
import { numbers2Config } from "./config/numbers2Config";
import { edit_languageConfig } from "./config/edit_languageConfig";
import { writingConfig } from "./config/writingConfig";
import { suggestionsConfig } from "./config/suggestionsConfig";
import { main_menuConfig } from "./config/main_menuConfig";
import { writing_submenuConfig } from "./config/writing_submenuConfig";
import { navigation_menuConfig } from "./config/navigation_menuConfig";
import { edit_menuConfig } from "./config/edit_menuConfig";
import { edit_lingertimeConfig } from "./config/edit_lingertimeConfig";
import { edit_settingsConfig } from "./config/edit_settingsConfig";
import { more_function_menuConfig } from "./config/more_function_menuConfig";
import { special_chars1Config } from "./config/special_chars1Config";
import { special_chars2Config } from "./config/special_chars2Config";
import { special_chars3Config } from "./config/special_chars3Config";

export const config = {
  layouts: {
      "numbers2": numbers2Config,
      "edit_language": edit_languageConfig,
      "writing": writingConfig,
      "suggestions": suggestionsConfig,
      "main_menu": main_menuConfig,
      "writing_submenu": writing_submenuConfig,
      "navigation_menu": navigation_menuConfig,
      "edit_menu": edit_menuConfig,
      "edit_lingertime": edit_lingertimeConfig,
      "edit_settings": edit_settingsConfig,
      "more_function_menu": more_function_menuConfig,
      "ABCDEFGH_menu": ABCDEFGH_menuConfig,
      "IJKLMNOP_menu": IJKLMNOP_menuConfig,
      "QRSTUVWX_menu": QRSTUVWX_menuConfig,
      "YZÆØÅ,?.._menu": YZ_menuConfig,
      "numbers": numbersConfig,
      "special_chars1": special_chars1Config,
      "special_chars2": special_chars2Config,
      "special_chars3": special_chars3Config
    }
};