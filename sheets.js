const { google } = require(`googleapis`);
const sheets = google.sheets(`v4`);
const spreadsheetId = `1mok1ObFRhS8jqP9KQ_MdHvpyFQr7ehsen_KWd8dtHIA`;
const fs = require(`fs`);
const client = require(`./authorization.js`);

/**
 * Sheet Url:
 * @see https://docs.google.com/spreadsheets/d/1mok1ObFRhS8jqP9KQ_MdHvpyFQr7ehsen_KWd8dtHIA/edit#gid=0
 */

function writeToSheet (auth, data) {
  const request = {
    spreadsheetId,
    range: `A1:F`,
    valueInputOption: `RAW`,
    resource: {
      values: data
    },
    auth: auth
  };
  sheets.spreadsheets.values.update(request, function (err) {
    if (err) console.error(err);
  });
};

function readFromSheets (auth) {
  const request = {
    spreadsheetId,
    range: `A1:F`,
    valueRenderOption: `UNFORMATTED_VALUE`,
    auth: auth
  };
  sheets.spreadsheets.values.get(request, function (err, response) {
    if (err) {
      console.error(err);
      return;
    }
    const data = response.data.values;
    const curData = JSON.stringify(data);
    fs.writeFileSync(`./test/DB.json`, curData);
    return curData;
  });
};

async function getStatus (auth) {
  const sheets = await getResponse();
  const request = {
    spreadsheetId,
    range: `A1:F`,
    valueRenderOption: `FORMATTED_VALUE`,
    auth: auth
  };
  const data = await sheets.spreadsheets.values.get(request);
  return data.status;
};

async function clear (auth) {
  const sheets = google.sheets({ version: `v4`, auth });
  sheets.spreadsheets.values.clear({ spreadsheetId,
    range: `A1:F` });
}

async function clearAll () {
  const auth = await client.authorize();
  await clear(auth);
}

async function getResponse () {
  const auth = await client.authorize();
  const sheets = google.sheets({ version: `v4`, auth });
  return sheets;
}

async function getIncorrectedResponce () {
  const sheets = google.sheets({ version: `v4` });
  const request = {
    spreadsheetId,
    range: `data`,
    valueRenderOption: `FORMATTED_VALUE` };
  const data = await sheets.spreadsheets.values.get(request);
  return data.status;
};

module.exports = {
  writeToSheet,
  readFromSheets,
  getStatus,
  clearAll,
  getIncorrectedResponce
};
