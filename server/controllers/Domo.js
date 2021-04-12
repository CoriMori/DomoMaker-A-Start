const models = require('../models');

const { Domo } = models;

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.class) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    class: req.body.class,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exsists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};

//delete based on id
const deleteDomo = (request, response) => {
  const req = request;
  const res = response;

  console.log(req.body._id);

  return Domo.DomoModel.deleteOne({ _id: req.body._id }, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    console.log('Deleted: ', docs);
    return res.json({ domos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
module.exports.deleteDomo = deleteDomo;
