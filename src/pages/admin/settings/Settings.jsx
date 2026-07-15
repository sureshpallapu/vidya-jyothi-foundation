import { useEffect, useState } from "react";
import SettingsSummary from "../../../components/admin/settings/SettingsSummary";
import OrganizationCard from "../../../components/admin/settings/OrganizationCard";
import FounderCard from "../../../components/admin/settings/FounderCard";
import ScholarshipCard from "../../../components/admin/settings/ScholarshipCard";
import {
  getSettings,
  updateSettings,
} from "../../../api/settingsApi";

import Swal from "sweetalert2";

function Settings() {

  const [settings, setSettings] = useState({

    trust_name: "",

    trust_address: "",

    trust_email: "",

    trust_phone: "",

    trust_website: "",

    founder_name: "",

    founder_designation: "",

    founder_message: "",

    application_prefix: "",

    session_timeout: 5,

  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

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

      const response = await getSettings();

      setSettings(response.data.data);

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  };

  /*
  |--------------------------------------------------------------------------
  | Handle Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {

    setSettings({

      ...settings,

      [e.target.name]: e.target.value,

    });

  };

  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const handleSave = async () => {

    try {

      setSaving(true);

      await updateSettings(settings);

      Swal.fire({

        icon: "success",

        title: "Success",

        text: "Settings updated successfully.",

        timer: 1500,

        showConfirmButton: false,

      });

    }

    catch (error) {

      console.error(error);

      Swal.fire({

        icon: "error",

        title: "Error",

        text: "Failed to update settings.",

      });

    }

    finally {

      setSaving(false);

    }

  };

  if (loading) {

    return (

      <div className="p-10">

        Loading...

      </div>

    );

  }


return (

  <div className="space-y-6">

    <div>

      <h1 className="text-3xl font-bold">

        Settings

      </h1>

      <p className="text-gray-500 mt-1">

        Manage Trust Configuration

      </p>

    </div>

    <SettingsSummary
      settings={settings}
    />

    <OrganizationCard
      settings={settings}
      handleChange={handleChange}
      handleSave={handleSave}
      saving={saving}
    />

    <FounderCard
    settings={settings}
    handleChange={handleChange}
    handleSave={handleSave}
    saving={saving}
/>
<ScholarshipCard
    settings={settings}
    handleChange={handleChange}
    handleSave={handleSave}
    saving={saving}
/>

  </div>

);

}

export default Settings;