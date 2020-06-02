const express = require('express');
const fs = require('fs');
const { v4: idGen } = require('uuid');

const app = express();
const DB_PATH = 'DB.json';

let board;
try {
  board = JSON.parse(fs.readFileSync(DB_PATH));
} catch (e) {
  board = [];
  save();
}

function save() {
  return new Promise((resolve, reject) => {
    fs.writeFile(DB_PATH, JSON.stringify(board), function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

app.use((req, res, next) => {
  if (req.is('json')) {
    let data = '';
    req.on('data', chunk => {
      data += chunk.toString();
    });

    req.on('end', () => {
      try {
        data = JSON.parse(data);
        req.body = data;
        next();
      } catch(e) {
        res.status(400).end();
      }
    });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  let actionStart = Date.now();
  res.once('finish', () => {
    let runTime = Date.now() - actionStart;
    console.log(req.method, req.path, res.statusCode, runTime);
  });
  next();
});




app.get('/board', (req, res) => {
  res.send(board);
});

app.post('/:listID/item', (req, res) => {
  let item = req.body;

  if (!item.name) {
    res.status(400).end();
    return;
  }

  item['id'] = idGen();
  board.lists[req.params.listID].items.push(item);
  save()
    .then(() => {
      res.status(201).end();
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

app.post('/new-list', (req, res) => {
  if (!req.body.name) {
    res.status(400).end();
    return;
  }

  let obj = {
    name: req.body.name,
    items: []
  }

  board.lists.push(obj);
  save()
    .then(() => {
      res.status(201).end();
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

app.put('/:listID/:itemID/:newListID', (req, res) => {
  let itemIndex = board.lists[req.params.listID].items.findIndex(i => i.id === req.params.itemID);

  if (itemIndex === -1) {
    res.status(404).end();
    return;
  }

  let tempItem = board.lists[req.params.listID].items.splice(itemIndex, 1);

  board.lists[req.params.newListID].items.push(tempItem[0]);
  save()
    .then(() => {
      res.status(200).end();
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

app.patch('/save-item-changes/:listID/:itemID', (req, res) => {
  console.log(req.params.listID);
  console.log(board.lists);
  let itemIndex = board.lists[req.params.listID].items.findIndex(i => i.id === req.params.itemID);

  if (itemIndex === -1) {
    res.status(404).end();
    return;
  }

  let tempItem = board.lists[req.params.listID].items.splice(itemIndex, 1);


  tempItem[0].name = req.body.name;
  tempItem[0].description = req.body.description;

  board.lists[req.params.listID].items.push(tempItem[0]);
  save()
    .then(() => {
      res.status(200).end();
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

app.delete('/delete-list/:listID', (req,res) => {
  console.log(req.params.listID);
  if (req.params.listID === -1) {
    res.status(404).end();
    return;
  }

  let tempItem = board.lists.splice(req.params.listID, 1);
  save()
    .then(() => {
      res.status(204).end();
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

app.delete('/delete-item/:listID/:itemID', (req, res) => {
  let itemIndex = board.lists[req.params.listID].items.findIndex(i => i.id === req.params.itemID);

  if (itemIndex === -1) {
    res.status(404).end();
    return;
  }

  board.lists[req.params.listID].items.splice(itemIndex, 1);

  save()
    .then(() => {
      res.status(204).end();
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

app.listen(8090, function() {
  console.log('Server started on 8090');
});
