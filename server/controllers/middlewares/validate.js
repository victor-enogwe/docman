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
  roleId: user.roleId,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
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
  'roleId',
  'createdAt',
  'updatedAt'
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

export default {
  showUserDetails,
  showDocumentDetails,
  filterUserDetails,
  filterDocumentDetails,
  validateUserKeys,
  validateDocumentKeys
};

