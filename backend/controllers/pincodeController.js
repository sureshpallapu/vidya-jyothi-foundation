const axios = require("axios");

/*
|--------------------------------------------------------------------------
| Get District & State by PIN Code
|--------------------------------------------------------------------------
*/

const getLocationByPincode = async (req, res) => {

  try {

    const { pincode } = req.params;

    /*
    |--------------------------------------------------------------------------
    | Validate PIN Code
    |--------------------------------------------------------------------------
    */

    if (!/^\d{6}$/.test(pincode)) {

      return res.status(400).json({

        success: false,

        message: "Invalid PIN Code.",

      });

    }

    /*
    |--------------------------------------------------------------------------
    | Call India Post API
    |--------------------------------------------------------------------------
    */

    const response = await axios.get(

      `https://api.postalpincode.in/pincode/${pincode}`

    );

    const data = response.data[0];

    if (

      data.Status !== "Success" ||

      !data.PostOffice ||

      data.PostOffice.length === 0

    ) {

      return res.status(404).json({

        success: false,

        message: "PIN Code not found.",

      });

    }

    const office = data.PostOffice[0];

    return res.json({

      success: true,

      district: office.District,

      state: office.State,

      postOffice: office.Name,

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Failed to fetch location.",

    });

  }

};

module.exports = {

  getLocationByPincode,

};