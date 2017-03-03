export default {
  query: 'ALTER TABLE Document ADD FULLTEXT INDEX `Document_Index` \
(`title`, `excerpt`);\
  ALTER TABLE User ADD FULLTEXT INDEX `User_Index` (`username`, `email`);'
};
