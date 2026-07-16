const axios = require("axios");

/*
|--------------------------------------------------------------------------
| Get Bank Details By IFSC
|--------------------------------------------------------------------------
*/

const getBankByIfsc = async (req, res) => {

  try {

    const { ifsc } = req.params;

    /*
    |--------------------------------------------------------------------------
    | Validate IFSC
    |--------------------------------------------------------------------------
    */

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())) {

      return res.status(400).json({

        success: false,

        message: "Invalid IFSC Code.",

      });

    }

    /*
    |--------------------------------------------------------------------------
    | RBI IFSC Lookup
    |--------------------------------------------------------------------------
    */

    const response = await axios.get(

      `https://ifsc.razorpay.com/${ifsc.toUpperCase()}`

    );

    return res.json({

      success: true,

      bankName: response.data.BANK,

      branch: response.data.BRANCH,

      city: response.data.CITY,

      district: response.data.DISTRICT,

      state: response.data.STATE,

    });

  }

  catch (error) {

    return res.status(404).json({

      success: false,

      message: "Invalid IFSC Code.",

    });

  }

};

module.exports = {

  getBankByIfsc,

};