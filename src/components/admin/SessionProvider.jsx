import { useEffect } from "react";

import { updateActivity } from "../../utils/adminAuth";

function SessionProvider() {

  useEffect(() => {

    const handleActivity = () => {

      updateActivity();

    };

    const events = [

      "mousemove",

      "mousedown",

      "keydown",

      "scroll",

      "touchstart",

      "click",

    ];

    events.forEach((event) => {

      window.addEventListener(

        event,

        handleActivity

      );

    });

    return () => {

      events.forEach((event) => {

        window.removeEventListener(

          event,

          handleActivity

        );

      });

    };

  }, []);

  return null;

}

export default SessionProvider;