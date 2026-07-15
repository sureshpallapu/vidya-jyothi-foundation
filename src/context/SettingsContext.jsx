import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getSettings,
} from "../api/settingsApi";

const SettingsContext =
  createContext();

export function SettingsProvider({
  children,
}) {

  const [settings, setSettings] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /*
  |--------------------------------------------------------------------------
  | Load Settings
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadSettings();

  }, []);

  const loadSettings = async () => {

    try {

      const response =
        await getSettings();

      setSettings(
        response.data.data
      );

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <SettingsContext.Provider
      value={{
        settings,
        loading,
        reloadSettings:
          loadSettings,
      }}
    >

      {children}

    </SettingsContext.Provider>

  );

}

export const useSettings = () => {

  return useContext(
    SettingsContext
  );

};