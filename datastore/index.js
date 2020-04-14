const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId( (err, id) => {
    fs.writeFile( exports.dataDir + '/' + id + '.txt', text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  var getFileNames = function() {
    return new Promise( (resolve, reject) => {
      fs.readdir(exports.dataDir, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  };

  var fileNamesToPromises = (files) => {
    return new Promise( (resolve, reject) => {
      resolve(files.map((filename) => {
        return new Promise ( (resolve, reject) => {
          let id = filename.substring(0, filename.length - 4);
          let text;
          fs.readFile(exports.dataDir + '/' + filename, (err, data) => {
            if (err) {
              reject(err);
            } else {
              text = data.toString();
              resolve({id, text});
            }
          });
        });
      }));
    });
  };

  var getAllFileObjects = function (arrayOfPromises) {
    return Promise.all(arrayOfPromises);
  };

  var sendBackObject = (arrayOfObjs) => {
    callback(null, arrayOfObjs);
  };

  getFileNames()
    .then(fileNamesToPromises)
    .then(getAllFileObjects)
    .then(sendBackObject);
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, data) => {
    if (err) {
      callback(err);
    } else {
      text = data.toString();
      callback(null, {id, text});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile( exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
