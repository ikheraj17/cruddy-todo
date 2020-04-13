const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId( (err, id) => {
    //console.log('Is there an err?:', err || 'no!');
    //console.log('THE ID IS:', id);
    //console.log('THE TEXT IS:', text);
    //console.log('the filename you are trying to put together is:', exports.dataDir + id + '.txt');
    // some function (err, id) { writes a file specified by id with the text and then calls the callback}
    fs.writeFile( exports.dataDir + '/' + id + '.txt', text, (err) => {
      if (err) {
        //console.log('THIS IS THE ERROR YOU WANT', err);
        callback(err);
      } else {
        //console.log('here????????????????????????');
        callback(null, { id, text });
      }
    }

    );
    //path: exports.dataDir + id + '.txt'

  });


  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
