const jwt = require("jsonwebtoken");

/**
 *
 * @param {String,JSON} data
 * @param {String} secretKey
 */

const tokenGenerator = async (data, secretKey) => {
  const token = await jwt.sign(data, secretKey);
  return token;
};

module.exports = { tokenGenerator };
