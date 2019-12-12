const path = require('path');
const microsofComputerVision = require('microsoft-computer-vision');

const logger = require('../../logger').child({ component: path.basename(__filename) });

module.exports = {
  getCardNameFromImage: async (image) => {
    try {
      const OCR_RES = await microsofComputerVision.orcImage({
        "Ocp-Apim-Subscription-Key": process.env.MS_CS_API_KEY,
        "language": "en",
        "detect-orientation": true,
        "content-type": "application/octet-stream",
        "body": image,
        "request-origin": "westus" // seems like this might need to come from somewhere...
      });
      logger.info(JSON.stringify(OCR_RES, null, 2));
      const name = OCR_RES.regions[0].lines[0].words.map(w => w.text).join(' ');
      return name;
    } catch (ex) {
      logger.error(ex.message);
      return undefined;
    }
  }
}