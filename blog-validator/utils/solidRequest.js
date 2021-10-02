const { 
  getSolidDataset,
  getThing,
  getStringNoLocale,
  getDatetime,
} = require("@inrupt/solid-client");
  
const { schema } = require("rdf-namespaces");
  
exports.readSolidData = async (userData) => {
  
  const mySolidBlogDataset = await getSolidDataset(
    userData.urlDataset,
  );

  const article = mySolidBlogDataset ? getThing(
    mySolidBlogDataset,
    userData.urlThing,
  ) : (null);

  let result = "";

  if (article === null) {
    result = "Article not found: " + userData.webId + " is not the author";
  }
  else {
    const title = getStringNoLocale(article, schema.headline);
    const content = getStringNoLocale(article, schema.text); 
    
    if (title !== userData.title || content !== userData.content) {
      result = "Article of " + userData.webId + " found, but the title or the content are different";
    }
    else {
      const datetime = getDatetime(article, schema.dateCreated);
      const date = datetime ? new Date(datetime) : null;
      const dateClient = new Date(userData.date);

      if ( date.getFullYear() !== dateClient.getFullYear() || date.getMonth() !== dateClient.getMonth() || date.getDate() !== dateClient.getDate()) {
        result = "Article of " + userData.webId + " found, but the date is different, the real date is: " + date;
      }
      else {
        result = "Article of " + userData.webId + " found, no anomalies were detected";
      }
    }
  }
  return result;
}


exports.searchArticle = async (userData) => {

  let article = {
    title: "",
    content: "",
    date: "",
    result: "",
  }
  const mySolidBlogDataset = await getSolidDataset(
    userData.urlDataset,
  );

  const articleThing = mySolidBlogDataset ? getThing(
    mySolidBlogDataset,
    userData.urlArticle,
  ) : (null);

  if (articleThing === null) {
    article.result = "Article not found";
  }
  else {
    article.result = "Article found";
    article.title = getStringNoLocale(articleThing, schema.headline);
    article.content = getStringNoLocale(articleThing, schema.text);
    article.date = getDatetime(articleThing, schema.dateCreated); 
  }

  return article;
}