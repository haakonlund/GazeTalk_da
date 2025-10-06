import
*
as
UserDataConst
from
"../constants/userDataConstants";



export
const
speakText
= (text)
=> {

    const
synth
=
window.speechSynthesis;

    if (synth.speaking)
 {

      synth.cancel();

    }



    const
utterance
=
new
SpeechSynthesisUtterance(text);

    utterance.rate
=
1;



    const
storedUserData
=
localStorage.getItem("userdata");

    let
userData
=
null;



    try {

      userData
=
storedUserData
?
JSON.parse(storedUserData)
:
null;

    } catch (error) {

      console.error("Error parsing userData from localStorage:", error);

    }



    const
settings
=
userData?.settings;

    const
language
=

      settings?.[UserDataConst.LANGUAGE]
||
UserDataConst.DEFAULT_LANGUAGE;

    const
formated_language
=
language
===
"da"
?
"da-DK"
:
"en-US";

    utterance.lang
=
formated_language
||
"da-DK";
// Default to Danish if not set

    synth.speak(utterance);

};




