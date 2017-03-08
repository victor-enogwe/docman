export default {
  query: 'ALTER TABLE Document ADD FULLTEXT INDEX `Document_Index` \
(`title`, `excerpt`);\
  ALTER TABLE User ADD FULLTEXT INDEX `User_Index` (`username`, `email`);',
  userDocument: {
    creatorId: 1,
    title: 'default admin document',
    excerpt: 'excerpt for default admin document',
    access: 'private',
    content: 'excerpt for default admin document'
  }
};
