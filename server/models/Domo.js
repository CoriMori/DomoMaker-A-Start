const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  class: {
    type: String,
    required: true,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  class: doc.class,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return DomoModel.find(search).select('name age class').lean().exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports = {
  DomoModel,
  DomoSchema,
};
