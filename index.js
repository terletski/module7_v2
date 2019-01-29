const mongoDB = require(`./mongoDbMethods.js`);
const sheet = require(`./sheets.js`);
const auth = require(`./authorization.js`);

const methods = process.argv[2];

async function mongoDbMethods () {
  switch (methods) {
    case `insertMany`:
      mongoDB.getDataFromJson();
      break;
    case `writeToSheets`:
      let data = await mongoDB.getData();
      const client = auth.authorize();
      sheet.writeToSheet(client, data);
      break;
    default: console.log(`Incorrect method`);
      client.close();
      break;
  }
}

mongoDbMethods();
