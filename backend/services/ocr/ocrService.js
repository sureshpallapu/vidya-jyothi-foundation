const Tesseract = require("tesseract.js");
const fs = require("fs");

/**
 * Extract text from an image
 */
const extractText = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found.");
    }

    const {
      data: { text },
    } = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(
            `OCR Progress: ${(m.progress * 100).toFixed(0)}%`
          );
        }
      },
    });

    return text.trim();
  } catch (error) {
    console.error("OCR Service Error:", error);
    throw error;
  }
};

module.exports = {
  extractText,
};