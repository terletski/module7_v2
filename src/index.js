const mongo = require(`./mongoDbMethods.js`);
const sheets = require(`./sheets.js`);
const auth = require(`./authorization.js`);
const methods = process.argv[2];

async function mongoDbMethods () {
  switch (methods) {
    case `findAllDocuments`:
      mongo.findAllDocuments();
      break;
    case `findDocument`:
      mongo.findDocument();
      break;
    case `deleteDocument`:
      mongo.deleteDocument();
      break;
    case `drop`:
      mongo.dropCollection();
      break;
    case `insertMany`:
      mongo.getDataFromJson();
      break;
    case `writeToSheets`:
      let data = await mongo.getData();
      const client = auth.authorize();
      sheets.writeToSheet(client, data);
      break;
    default: console.log(`Incorrect method`);
      client.close();
      break;
  }
}

mongoDbMethods();
