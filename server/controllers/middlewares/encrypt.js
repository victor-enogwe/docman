import crypto from 'crypto';

const algorithm = 'aes-256-ctr';

const encrypt = (text, password) => {
  const cipher = crypto.createCipher(algorithm, password);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (encrypted, password) => {
  const decipher = crypto.createDecipher(algorithm, password);
  let dec = decipher.update(encrypted, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

export { encrypt };
export { decrypt };

