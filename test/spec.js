/* eslint-disable no-undef */
const chai = require(`chai`).use(require(`chai-as-promised`));
const auth = require(`../src/authorization.js`);
const client = auth.authorize();
const expect = chai.expect;
const sendRequest = require(`../src/sheets`);
const readFromDb = require(`../src/mongoDBMethods`);
const path = require(`path`);
const logger = require(`../logger/logger`).logger;

describe(`Does the data match`, () => {
  logger.info(`Start tests`);
  it(`should get response status 200 OK`, async () => {
    logger.info(`Should get response status 200 OK`);
    const data = await sendRequest.getStatus(client);
    logger.debug(`1!!!${data}`);
    expect(data).to.eql(200);
  });
  it(`request should be rejected`, async () => {
    logger.info(`Request should be rejected`);
    const data = await sendRequest.getIncorrectedResponce();
    logger.debug(`2!!!${data}`);
    // eslint-disable-next-line no-unused-expressions
    expect(data).to.be.rejected;
  });
  it(`sheets should be empty`, async () => {
    logger.info(`Should return <undefined>`);
    sendRequest.clearAll();
    const data = await sendRequest.readFromSheets(client);
    logger.debug(data);
    expect(data).to.be.a(`undefined`);
  });
  it(`should equal data from Google Sheets and DB`, async () => {
    await sendRequest.readFromSheets(client);
    const dataFromDb = await readFromDb.getData();
    const dataFromSheets = require(path.resolve(`./test/DB.json`));
    logger.debug(`4!!!${dataFromDb}`);
    logger.debug(`4!!!${dataFromSheets}`);
    expect(dataFromSheets).to.be.equal(dataFromDb, `Data do not match`);
  });
});
