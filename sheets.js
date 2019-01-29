const { google } = require(`googleapis`);
const sheets = google.sheets(`v4`);

/**
 * Sheet Url:
 * @see https://docs.google.com/spreadsheets/d/1mok1ObFRhS8jqP9KQ_MdHvpyFQr7ehsen_KWd8dtHIA/edit#gid=0
 */

function writeToSheet (auth, data) {
  const request = {
    spreadsheetId: `1mok1ObFRhS8jqP9KQ_MdHvpyFQr7ehsen_KWd8dtHIA`,
    range: `A1:H`,
    valueInputOption: `RAW`,
    resource: {
      values: data
    },
    auth: auth
  };
  sheets.spreadsheets.values.update(request, function (err) {
    if (err) {
      console.error(err);
    }
  });
};

module.exports = {
  writeToSheet
};
