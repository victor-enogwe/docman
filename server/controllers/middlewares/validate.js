/**
 * Function to display user details
 * @param {String} user user object
 * @returns {Object} user
 */
const showUserDetails = user => ({
  id: user.id,
  username: user.username,
  firstname: user.firstname,
  lastname: user.lastname,
  email: user.email,
  roleId: user.roleId
});

/**
 * Function to display user details
 * @param {String} document document object
 * @returns {Object} user
 */
const showDocumentDetails = document => ({
  id: document.id,
  creatorId: document.creatorId,
  title: document.title,
  excerpt: document.excerpt,
  content: document.content,
  authorized: document.authorized,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt
});

/**
 * Filter for user details search
 * @returns {Object} array of filter
 */
const filterUserDetails = () => ([
  'id',
  'username',
  'firstname',
  'lastname',
  'email',
  'roleId'
]);

/**
 * Filter for document details search
 * @returns {Object} array of filter
 */
const filterDocumentDetails = () => ([
  'id',
  'creatorId',
  'title',
  'excerpt',
  'content',
  'access',
  'createdAt',
  'updatedAt'
]);

/**
 * Function to validate request body keys
 * @param {Object} request request body object
 * @param {Boolean} isAdmin switch for when user is admin
 * @returns {Object} array constaining validity and invalid keys
 */
const validateUserKeys = (request, isAdmin) => {
  const requestKeys = Object.keys(request);
  const validSchema = [
    'username',
    'firstname',
    'lastname',
    'email',
    'password',
    'password_confirmation'
  ];
  if (isAdmin) {
    validSchema.push('roleId');
  }
  const badRequestBodyKeys = [];
  for (const key of requestKeys) {
    if (!validSchema.includes(key)) {
      badRequestBodyKeys.push(key);
    }
  }
  const validity = badRequestBodyKeys.length === 0;
  return [validity, badRequestBodyKeys];
};

/**
 * Function to validate request body keys
 * @param {Object} request request body object
 * @param {Boolean} isUpdate switch for when user is admin
 * @returns {Object} array constaining validity and invalid keys
 */
const validateDocumentKeys = (request, isUpdate) => {
  const requestKeys = Object.keys(request);
  const validSchema = [
    'excerpt',
    'access',
    'content',
    'title',
    'authorized'
  ];
  if (isUpdate) {
    delete validSchema[3];
  }
  const badRequestBodyKeys = [];
  for (const key of requestKeys) {
    if (!validSchema.includes(key)) {
      badRequestBodyKeys.push(key);
    }
  }
  const validity = badRequestBodyKeys.length === 0;
  return [validity, badRequestBodyKeys];
};

 /**
 * Function to filter documents by access
 * @param {String} access the access level
 * @returns {Object} the access level if valid
 * @returns {Object} undefined if an invalid access is supplied
 */
const filterDocumentsByAccess = (access) => {
  const accepted = ['public', 'private', 'users'];
  if (accepted.includes(access)) {
    return access;
  }
  return undefined;
};

/**
 * Function to generate a unique array from an array
 * @param {Object} array the supplied array
 * @returns {Object} the filtered array
 */
const uniqueArray = array => array
.filter((value, index) => array.indexOf(value) === index);

/**
 * Function to create a jwt encoder object
 * @returns {Object} the jwt encoder object
 */
const jwtEncode = () => {
  const jwtSecret = process.env.JWT_SECRET.replace(/\s/g, '');
  const secret = uniqueArray(jwtSecret.split('').reverse());
  const jwtDict = {};
  uniqueArray(jwtSecret.split('')).forEach((element, index) => {
    jwtDict[element] = secret[index];
  });
  return jwtDict;
};

/**
 * Function to encrypt a jwt strinh
 * @param {String} token the jwt token
 * @returns {String} the encoded jwt string
 */
const encryptJwt = (token) => {
  const dict = jwtEncode();
  token = token.split('.');
  return `${token[0]}.${token[1].split('').map((key) => {
    if (dict[key]) {
      return dict[key];
    }
    return key;
  })
  .join('')}.${token[2]}`;
};

/**
 * Function to create a reverse object from an object
 * @param {Object} json a valid json object
 * @returns {Object} the reverse object
 */
const swap = (json) => {
  const reverseJson = {};
  const keys = Object.keys(json);
  keys.forEach((key) => {
    reverseJson[json[key]] = key;
  });
  return reverseJson;
};

/**
 * Function to decrypt the encrypted jwt token
 * @param {String} reverseToken the encoded jwt token
 * @returns {Object} the decrypted token
 */
const decryptJwt = (reverseToken) => {
  if (reverseToken) {
    if (reverseToken.split('.').length === 3) {
      const reverseDict = swap(jwtEncode());
      reverseToken = reverseToken.split('.');
      return `${reverseToken[0]}.${reverseToken[1].split('')
      .map((character) => {
        if (reverseDict[character]) {
          return reverseDict[character];
        }
        return character;
      }).join('')}.${reverseToken[2]}`;
    }
    return reverseToken;
  }
  return '';
};

/**
 * Function to return a response message
 * @param {Object} results the result object
 * @param {Object} request the request object
 * @param {Object} response the response object
 * @returns {Object} a response json object
 */
const message = (results, request, response) => {
  if (results.rows.length === 0) {
    return response.status(404).json({
      success: false,
      message: `no results found for your query ${request.query.phrase}`
    });
  }
  return response.status(200).json({ success: true, results });
};

export default {
  showUserDetails,
  showDocumentDetails,
  filterUserDetails,
  filterDocumentDetails,
  validateUserKeys,
  validateDocumentKeys,
  filterDocumentsByAccess,
  encryptJwt,
  decryptJwt,
  message
};

