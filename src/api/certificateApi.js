import axios from "./axios";

/*
|--------------------------------------------------------------------------
| Generate Certificate
|--------------------------------------------------------------------------
*/

export const generateCertificate = (data) => {

    return axios.post(

        "/fundraising/certificates",

        data

    );

};

/*
|--------------------------------------------------------------------------
| Get Certificate
|--------------------------------------------------------------------------
*/

export const getCertificate = (

    certificateCode

) => {

    return axios.get(

        `/fundraising/certificates/${certificateCode}`

    );

};

/*
|--------------------------------------------------------------------------
| List Certificates
|--------------------------------------------------------------------------
*/

export const listCertificates = () => {

    return axios.get(

        "/fundraising/certificates"

    );

};

/*
|--------------------------------------------------------------------------
| Verify Certificate
|--------------------------------------------------------------------------
*/

export const verifyCertificate = (

    certificateCode

) => {

    return axios.get(

        `/fundraising/certificates/verify/${certificateCode}`

    );

};

/*
|--------------------------------------------------------------------------
| Archive Certificate
|--------------------------------------------------------------------------
*/

export const archiveCertificate = (

    certificateCode

) => {

    return axios.patch(

        `/fundraising/certificates/${certificateCode}/archive`

    );

};

/*
|--------------------------------------------------------------------------
| Email Certificate
|--------------------------------------------------------------------------
*/

export const emailCertificate = (

    certificateCode

) => {

    return axios.post(

        `/fundraising/certificates/${certificateCode}/email`

    );

};