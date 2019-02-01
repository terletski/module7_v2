const { google } = require(`googleapis`);
const spreadsheetId = `1mok1ObFRhS8jqP9KQ_MdHvpyFQr7ehsen_KWd8dtHIA`;
const client = require(`./authorization.js`);

/**
 * Sheet Url:
 * @see https://docs.google.com/spreadsheets/d/1mok1ObFRhS8jqP9KQ_MdHvpyFQr7ehsen_KWd8dtHIA/edit#gid=0
 */

async function writeToSheet (auth, data) {
  const sheets = await getResponse();
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
    if (err) throw err;
  });
};

async function readFromSheets () {
  const sheets = await getResponse();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId, range: `A1:F`, valueRenderOption: `UNFORMATTED_VALUE`
  });
  const data = response.data.values;
  return data;
};

async function getStatus () {
  const sheets = await getResponse();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId, range: `A1:F`, valueRenderOption: `UNFORMATTED_VALUE`
  });
  const data = response.status;
  return data;
};

async function getHeaders () {
  const sheets = await getResponse();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId, range: `A1:F`, valueRenderOption: `UNFORMATTED_VALUE`
  });
  const data = JSON.stringify(response.headers);
  return data;
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
  const sheets = await getResponse();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId, range: `Z1:Z`, valueRenderOption: `UNFORMATTED_VALUE`
  });
  const data = response.data.values;
  return data;
};

async function writeEmptyRange (data, auth) {
  const sheets = await getResponse();
  const resource = { data };
  return sheets.spreadsheets.values.update({
    spreadsheetId, valueInputOption: `RAW`, resource, auth: auth });
}

async function writeIncorrectspreadsheetId (data, auth) {
  const sheets = await getResponse();
  const resource = { data };
  return sheets.spreadsheets.values.update({
    range: `A1:F`, valueInputOption: `RAW`, resource, auth: auth });
}

module.exports = {
  writeToSheet,
  readFromSheets,
  getStatus,
  clearAll,
  getIncorrectedResponce,
  getHeaders,
  writeEmptyRange,
  writeIncorrectspreadsheetId
};
