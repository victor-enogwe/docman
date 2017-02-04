const Documents = {
  create(req, res) {
    res.send('I am creating a doc');
  },
  update(req, res) {
    res.send('I am updating a doc');
  },
  delete(req, res) {
    res.send('I am deleting a doc');
  },
  findAll(req, res) {
    res.send({message: 'finding All doc'})
  },
  findOne(req, res) {
    res.send('I am finding a doc');
  }
}

export default Documents;