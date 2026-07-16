/*
|--------------------------------------------------------------------------
| Common Abbreviations
|--------------------------------------------------------------------------
*/

const ABBREVIATIONS = [

  "JNTU",

  "SVU",

  "AU",

  "SKU",

  "YVU",

  "RGUKT",

  "IIT",

  "IIIT",

  "NIT",

  "AIIMS",

  "BHEL",

  "ONGC",

  "DRDO",

];






/*
|--------------------------------------------------------------------------
| Convert Text to Title Case
|--------------------------------------------------------------------------
|
| Example:
|
| aditya engineering college
|
| ↓
|
| Aditya Engineering College
|
*/

export const toTitleCase = (text = "") => {

  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => {

      if (!word) return "";

      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );

    })
    .join(" ");

};