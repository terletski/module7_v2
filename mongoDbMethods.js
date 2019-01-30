const MongoClient = require(`mongodb`).MongoClient;
const users = require(`./models/users.json`);
const cars = require(`./models/cars.json`);

async function findDocument() {
  const client = await getClient();
  const db = await getDB(client);
  const query = { address: /^S/ };
  db.collection(`users`).find(query).toArray((err, result) => {
    if (err) throw err;
    console.log(result);
  });
  client.close();
};

async function deleteDocument() {
  const client = await getClient();
  const db = await getDB(client);
  const myquery = { address: `Mountain 21` };
  db.collection(`users`).deleteOne(myquery, (err) => {
    if (err) throw err;
    const myQueryJSON = JSON.stringify(myquery);
    console.log(`1 document deleted ${myQueryJSON}`);
  });
  client.close();
};

async function dropCollection() {
  const client = await getClient();
  const db = await getDB(client);
  db.collection(`users`).drop((err, delOK) => {
    if (err) throw err;
    if (delOK) console.log(`Collection deleted`);
  });
  client.close();
};

async function getDataFromJson() {
  const client = await getClient();
  const db = await getDB(client);
  db.collection(`users`).insertMany(users, (err) => {
    if (err) throw err;
    else {
      console.log(users);
      console.log(`Data succesfully loaded from <users> collections`);
    }
  });
  db.collection(`cars`).insertMany(cars, (err) => {
    if (err) throw err;
    else {
      console.log(cars);
      console.log(`Data succesfully loaded from <cars> collections`);
    }
  });
  client.close();
};

async function getQuery() {
  const client = await getClient();
  const db = await getDB(client)
  const mysort = { name: 1 };
  const result = await db.collection(`users`).aggregate([
    {
      $lookup:
      {
        from: `cars`,
        localField: `user_id`,
        foreignField: `user_id`,
        as: `cardetails`
      }
    },
    { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: [`$cardetails`, 0] }, `$$ROOT`] } } },
    { $project: { cardetails: 0 } }
  ]).sort(mysort).toArray();
  client.close();
  return result;
};

async function getClient() {
  const url = `mongodb://localhost:27017/`;
  const client = MongoClient.connect(url, { useNewUrlParser: true });
  console.log(`Successful server connection`);
  return client;
};

async function getDB(client) {
  const dbName = `usersdb`;
  const db = client.db(dbName);
  return db;
};

async function getTitle() {
  let object = await getQuery();
  let arrayTitle = [];
  for (let key in object[0]) {
    arrayTitle.push(key);
  }
  return arrayTitle;
};

async function getBody() {
  let object = await getQuery();
  let arrayBody = [];
  object.forEach(element => {
    let array = [];
    for (let key in element) {
      array.push(element[key]);
    }
    arrayBody.push(array);
  });
  return arrayBody;
};

async function getData() {
  const body = await getBody();
  const title = await getTitle();
  body.unshift(title);
  return body;
};

module.exports = {
  findDocument,
  deleteDocument,
  dropCollection,
  getDataFromJson,
  getQuery,
  getData
};
