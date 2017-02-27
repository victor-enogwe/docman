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
    'creatorId',
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

const filterDocumentsByAccess = (access) => {
  const accepted = ['public', 'private', 'users'];
  if (accepted.includes(access)) {
    return access;
  }
  return undefined;
};

const uniqueArray = array => array
.filter((value, index) => array.indexOf(value) === index);

const jwtEncode = () => {
  const jwtSecret = process.env.JWT_SECRET.replace(/\s/g, '');
  const secret = uniqueArray(jwtSecret.split('').reverse());
  const jwtDict = {};
  uniqueArray(jwtSecret.split('')).forEach((element, index) => {
    jwtDict[element] = secret[index];
  });
  return jwtDict;
};

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


const swap = (json) => {
  const reverseJson = {};
  if (typeof json === 'object') {
    for (const key in json) {
      if (key) reverseJson[json[key]] = key;
    }
    return reverseJson;
  }
  return {};
};

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

export default {
  showUserDetails,
  showDocumentDetails,
  filterUserDetails,
  filterDocumentDetails,
  validateUserKeys,
  validateDocumentKeys,
  filterDocumentsByAccess,
  encryptJwt,
  decryptJwt
};

