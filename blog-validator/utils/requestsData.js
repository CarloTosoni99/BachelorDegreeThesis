const { last } = require('rdf-namespaces/dist/hydra');
const sqlite3 = require('sqlite3');

var db;

exports.initDB = () => {

  db = new sqlite3.Database('./solid.db');
  db.run('CREATE TABLE IF NOT EXISTS userAuth(webID TEXT, urlDataset TEXT, urlThing TEXT, title TEXT, content TEXT, date TEXT, checkDate TEXT, result TEXT)');
}

exports.insertDataToDB = (data, result) => {
  const date = new Date();
  const stringDate = date.toISOString();
  const slicedDate = stringDate.slice(0, 16);
  const replacedDate = slicedDate.replace("T", " ");
  db.run('INSERT INTO userAuth(webID, urlDataset, urlThing, title, content, date, checkDate, result) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', 
    [data.webId, data.urlDataset, data.urlThing, data.title, data.content, data.date.toString(), replacedDate, result],
    (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log('Row was added to the table');
  })
}

exports.getDataFromDB = async (url) => {

  let userData = {
    webId: "",
    urlDataset: "",
    urlThing: "",
    title: "",
    content: "",
    date: "",
    checkDate: null,
    result: "",
  };

  const checkDate = {
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
  };

  const lastDate = {
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
  };

  let date = null;

  let sql = `
    SELECT webID, urlDataset, urlThing, title, content, date, checkDate, result
    FROM userAuth
    WHERE urlThing = ?`;

  db.each(sql, [url], (err, row) => {
    if (err) {
      throw err;
    }
    checkDate.year = row.checkDate.slice(0, 4);
    checkDate.month = row.checkDate.slice(5, 7);
    checkDate.day = row.checkDate.slice(8, 10);
    checkDate.hour = row.checkDate.slice(11, 13);
    checkDate.minute = row.checkDate.slice(14, 16);

    lastDate.Year = date ? date.slice(0, 4) : "";
    lastDate.Month = date ? date.slice(5, 7) : "";
    lastDate.Day = date ? date.slice(8, 10) : "";
    lastDate.Hour = date ? date.slice(11, 13) : "";
    lastDate.Minute = date ? date.slice(14, 16) : "";

    const checkResult = checkDates(checkDate, lastDate, date);

    if (checkResult) {
      userData.webId = row.webID;
      userData.urlDataset = row.urlDataset;
      userData.urlThing = row.urlThing;
      userData.title = row.title;
      userData.content = row.content;
      userData.date = row.date;
      userData.checkDate = row.checkDate;
      userData.result = row.result;

      date = row.checkDate;
    }
  });

  await sleep(1000);
  return userData;
}


function checkDates(checkDate, lastDate, date) {

  if (date === null)
    return true;
  
  if (Number(checkDate.year) > Number(lastDate.year))
    return true;
  else if (Number(checkDate.year) < Number(lastDate.year))
    return false;

  if (Number(checkDate.month) > Number(lastDate.month))
    return true;
  else if (Number(checkDate.month) < Number(lastDate.month))
    return false;

  if (Number(checkDate.day) > Number(lastDate.day))
    return true;
  else if (Number(checkDate.day) < Number(lastDate.day))
    return false;

  if (Number(checkDate.hour) > Number(lastDate.hour))
    return true;
  else if (Number(checkDate.hour) < Number(lastDate.hour))
    return false;

  if (Number(checkDate.minute) > Number(lastDate.minute))
    return true;
  else 
    return false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}