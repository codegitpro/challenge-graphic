const mongoose = require('mongoose');
const { generateRandomString } = require('../lib/shortner');

const { Schema } = mongoose;

const urlSchema = new Schema({
  originalUrl: {
    type: String,
    required: true
  },
  urlCode: {
    type: String
  },
});


/**
 * Statics
 */
urlSchema.statics = {

  /**
   * Generate unique url code that doesn't exist in the database
   * @returns {String} unique url code string
   */
  async generateUniqueCode() {
    try {
      while (true) {
        let code = generateRandomString();
        const result = await this.findOne({ urlCode: code });
        if (!result) {
          return code;
        }
      }
    } catch(error) {
      throw(error);
    }
    
  }
}

module.exports = mongoose.model('Url', urlSchema);