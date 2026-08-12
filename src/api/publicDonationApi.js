import axios from "./axios";

/*
|--------------------------------------------------------------------------
| Create Razorpay Donation Order
|--------------------------------------------------------------------------
*/

export const createDonationOrder = (data) => {

    return axios.post(
        "/public/donations/create-order",
        data
    );

};


/*
|--------------------------------------------------------------------------
| Verify Razorpay Donation Payment
|--------------------------------------------------------------------------
*/

export const verifyDonationPayment = (data) => {

    return axios.post(
        "/public/donations/verify-payment",
        data
    );

};