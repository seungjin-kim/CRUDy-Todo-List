const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // //console.log('ID', id);
  // items[id] = text;

  // fs.writeFile(path.join(exports.dataDir, 'todo1.txt'), text, (err) => {
  //   //console.log('data directory', exports.dataDir);
  //   if (err) {
  //     console.log('Create Todo Error', err);
  //   } else {
  //     callback(null, text);
  //   }
  // });

  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      if (err) {
        console.log('Create Todo Error', err);
        //callback(err);
      } else {
        callback(null, {id, text});
      }
    } );
  //callback(null, { id, text });
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('Read Directory Error', err);
    } else {
      var data = _.map(files, (id, text) => {
        var fileName = id.split('.');
        return { id: fileName[0], text: fileName[0] };
      });
      callback(null, data);
    }

  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, text) => {
    if (err) {
      console.log('Error Read One', err);
      callback(err);
    } else {
      console.log('read one success');
      callback(null, {id, text: text.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, fileData) => {
    if (err) {
      console.log('Error Update Text', err);
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          console.log('Update error', err);
          callback(err);
        } else {
          callback(null, {id, text});
          console.log('Successfuly updated todo');
        }
      });
    }
  });

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