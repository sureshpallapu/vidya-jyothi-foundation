const generateDonationCode = (id) => {

    const year = new Date().getFullYear();

    return `DON-${year}-${String(id).padStart(6, "0")}`;

};

module.exports = generateDonationCode;