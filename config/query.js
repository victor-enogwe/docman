import faker  from 'Faker';

export default {
  query: 'ALTER TABLE Document ADD FULLTEXT INDEX `Document_Index` \
(`title`, `excerpt`);\
  ALTER TABLE User ADD FULLTEXT INDEX `User_Index` (`username`, `email`);',
  userDocument: {
    creatorId: 1,
    title: faker.Lorem.sentence(),
    excerpt: faker.Lorem.sentences(),
    access: 'private',
    content: faker.Lorem.paragraph()
  }
};
