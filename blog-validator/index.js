const express = require("express");
const cookieSession = require("cookie-session");
const bodyParser = require('body-parser');

const sr = require("./utils/solidRequest");
const rd = require("./utils/requestsData");

const app = express();

rd.initDB();
const port = 8081;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// The following snippet ensures that the server identifies each user's session
// with a cookie using an express-specific mechanism
app.use(
  cookieSession({
    name: "session",
    // These keys are required by cookie-session to sign the cookies.
    keys: [
      "Required, but value not relevant for this demo - key1",
      "Required, but value not relevant for this demo - key2",
    ],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
  }
);

app.post("/auth", async (req, res) => {
  const result = await sr.readSolidData(req.body);
  res.send(result)
  rd.insertDataToDB(req.body, result)

});

app.get("/check", (req, res) => {

  let htmlpage =`
    <html>
    <head>
    <meta charset="utf-8">
    <title>Blog Validator</title>
    </head>
    <body>
      <h1>Blog Validator</h1>
      <br/>
      <h2>Use the input below to see which data the application \"my-solid-blog\" sent for the control</h2>
      <p>You have to enter the url of the article checked</p>
      <form action="/control" method="POST">
        <input type="text" name="url" placeholder="Article's url here" size="100"/>
        <button type="submit">check</button>
      </form>
      <br/>
      <br/>
      <h2>Use the inputs below to search the content of an article</h2>
      <form action="/read" method="POST">
        <p>Enter here the SolidDataset's url</p>
        <input type="text" name="urlDataset" placeholder="Dataset's url here" size="100"/>
        <p>Enter here the Article's url</p>
        <input type="text" name="urlArticle" placeholder="Article's url here" size="100"/>
        <p>Then press "check"</p>
        <button type="submit">check</button>
      </form>
    </body>
    </html>`
  res.send(htmlpage);
});

app.post("/control", async (req, res) => {

  let userData = {
    webId: "",
    urlDataset: "",
    title: "",
    content: "",
    date: "",
    checkDate: null,
    result: "",
  }

  userData = await rd.getDataFromDB(req.body.url)
  const htmlpage =`
    <html>
    <head>
      <meta charset="utf-8">
      <title>Blog Validator</title>
    </head>
    <body>
      <h3>Searched article: ` + req.body.url + `</h3>
      <h2>Data sent by the client</h2>
      <p>DATI DI: ` + userData.webId + `</p>
      <p>URLDATASET: ` + userData.urlDataset +`</p>
      <p>TITLE: ` + userData.title + `</p>
      <p>CONTENT: ` + userData.content + `</p>
      <p>ARTICLE DATE: ` + userData.date + `</p>
      <h2 style="color: #0fbf15">RESULT: ` + userData.result + `</h2>
      <h2>CONTROL'S DATE: ` + userData.checkDate.toString() + `</h2>
    </body>
    </html>`
  res.send(htmlpage);
});

app.post("/read", async (req, res) => {

  let article = {
    title: "",
    content: "",
    date: "",
    result: "",
  }

  article = await sr.searchArticle(req.body);

  const htmlpage =`
    <html>
    <head>
      <meta charset="utf-8">
      <title>Blog Validator</title>
    </head>
    <body>
      <h3>Searched article: ` + req.body.urlDataset + `</h3>
      <h3>Searched article: ` + req.body.urlArticle + `</h3>
      <br/>
      <h2>RESULT: ` + article.result + `</h2>
      <br/>
      <p>TITLE: ` + article.title + `</p>
      <p>CONTENT: ` + article.content + `</p>
      <p>DATE: ` + article.date + `</p>
    </body>
    </html>`
    res.send(htmlpage);
});

app.listen(port, () => {
  console.log(
    `Server running on port [${port}]. `
  );
});
