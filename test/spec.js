/* eslint-disable no-undef */
const chai = require(`chai`);
const chaiAsPromised = require(`chai-as-promised`);
chai.use(chaiAsPromised);
const expect = chai.expect;
const auth = require(`../src/authorization`);
const client = auth.authorize();
const sendRequest = require(`../src/sheets`);
const readFromDb = require(`../src/mongoDBMethods`);
const logger = require(`../logger/logger`).logger;

describe(`Google sheets API`, () => {
  logger.info(`Start tests`);
  it(`should get response status 200 OK`, async () => {
    logger.info(`Should get response status 200 OK`);
    const status = await sendRequest.getStatus();
    logger.debug(`1-->${status}`);
    expect(status).to.be.equal(200);
  });
  it(`request should be undefined`, async () => {
    logger.info(`request should be undefined`);
    const data = await sendRequest.getIncorrectedResponce();
    logger.debug(`2-->${data}`);
    expect(data).to.be.a(`undefined`);
  });
  it(`sheets should be empty`, async () => {
    logger.info(`Should return <undefined>`);
    sendRequest.clearAll();
    const data = await sendRequest.readFromSheets(client);
    logger.debug(`3-->${data}`);
    expect(data).to.be.a(`undefined`);
  });
  it(`should not equal data from Google Sheets and DB`, async () => {
    logger.info(`should not equal data from Google Sheets and DB`);
    const dataFromDb = await readFromDb.getData();
    const dataFromSheets = await sendRequest.readFromSheets(client);
    logger.debug(`4--> Data from database:${dataFromDb}`);
    logger.debug(`4--> Data from sheets:${dataFromSheets}`);
    expect(dataFromSheets).to.not.equal(dataFromDb, `Data has a match`);
  });
  it(`header should contain charset=UTF-8`, async () => {
    logger.info(`should contain charset=UTF-8`);
    const data = await sendRequest.getHeaders();
    logger.debug(`5-->${data}`);
    expect(data).to.be.contain(`charset=UTF-8`);
  });
  it(`should write with ampty range`, async () => {
    logger.info(`should write with ampty range`);
    const data = await sendRequest.writeEmptyRange(`data`, client);
    logger.debug(`6-->${data}`);
    return expect(data).to.be.rejected;
  });
  it(`should write with incorrect spreadsheetId`, async () => {
    logger.info(`should write with incorrect spreadsheetId`);
    const data = await sendRequest.writeIncorrectspreadsheetId(`data`, client);
    logger.debug(`7-->${data}`);
    return expect(data).to.be.rejected;
  });
});
