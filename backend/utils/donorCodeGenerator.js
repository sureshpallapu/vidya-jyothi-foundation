// utils/donorCodeGenerator.js

const generateDonorCode = (id) => {
    return `DONR-${String(id).padStart(6, "0")}`;
};

module.exports = generateDonorCode;