import crypto from 'crypto';

const algorithm = 'aes-256-ctr';

/**
 * Function to encrypt a password
 * @param {String} text the string to be encrypted
 * @param {String} password the encryption password
 * @returns {String} an encrypted password string
 */
const encrypt = (text, password) => {
  const cipher = crypto.createCipher(algorithm, password);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

/**
 * Function to decrypt a password encrypted using bcrypt
 * @param {String} encrypted the encrypted password
 * @param {String} password the validating password
 * @returns {String} the decrypted password
 */
const decrypt = (encrypted, password) => {
  const decipher = crypto.createDecipher(algorithm, password);
  let dec = decipher.update(encrypted, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

export { encrypt };
export { decrypt };

