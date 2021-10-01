import { 
  saveSolidDatasetAt,
  getSolidDataset,
  getSourceUrl,
  getUrl,
  removeThing,
  getThing,
  getThingAll,
  setThing,
  createThing,
  addDatetime,
  addDecimal,
  addStringNoLocale,
  setStringNoLocale,
  getDatetime,
  getDecimal,
} from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import React, { useEffect, useState } from "react";
import { getOrCreateDataset } from "../utils/GetOrCreateDataset.js";
import WriteArticles from './WriteArticles.js';
import Article from './Article.js';
import { schema, rdf, solid } from 'rdf-namespaces';


function Articlelist(props) {
  const { session } = useSession();
  const [articlelist, setArticlelist] = useState();

  const webId = session.info.webId ? session.info.webId : props.webId;
  const identifier = Math.random();


  useEffect(() => {
    
    const fetchDataset = async () => {
      try {
        const myDataset = await getSolidDataset(
          webId,
          {
          fetch: session.fetch,
          },
        );
        const profile = getThing(
          myDataset,
          webId,
        );

        const publicTypeIndexUrl = getUrl( profile, solid.publicTypeIndex );

        const podUrl = getUrl(
          profile,
          "http://www.w3.org/ns/pim/space#storage",
        );
        const containerUrl = podUrl + "public/my-solid-blog/articlelist.ttl";
        const list = await getOrCreateDataset(
          containerUrl,
          session.fetch,
          publicTypeIndexUrl,
        );
        setArticlelist(list);

      }
      catch(e) {
        console.log("an error occurr");
        console.log(e);
      }
    };
    
    fetchDataset();
    
  }, [session], webId);
  

  const addArticle = async (articleTitle, articleText) => {
    const articlelistUrl = getSourceUrl(articlelist);

    const thingWithType = addStringNoLocale(
      createThing(),
      rdf.type,
      schema.TextDigitalDocument,
    );

    const thingWithIdentifier = addDecimal(
      thingWithType,
      schema.identifier,
      identifier,
    );
    const thingWithTitle = addStringNoLocale(
      thingWithIdentifier,
      schema.headline,
      articleTitle,
    );
    const thingWithDate = addDatetime(
      thingWithTitle,
      schema.dateCreated,
      new Date(),
    );
    const thingWithText = addStringNoLocale(
      thingWithDate,
      schema.text,
      articleText,
    );

    const updatedArticlelist = setThing(
      articlelist,
      thingWithText,
    );
    
    const savedUpdatedArticlelist = await saveSolidDatasetAt(
      articlelistUrl,
      updatedArticlelist,
      {fetch: session.fetch},
    );
    setArticlelist(savedUpdatedArticlelist);
  };
  
  const removeArticle = async (thing) => {
    const articlelistUrl = getSourceUrl(articlelist);
    const updatedArticlelist = removeThing(
      articlelist,
      thing,
    );
    const savedUpdatedArticlelist = await saveSolidDatasetAt(
      articlelistUrl,
      updatedArticlelist,
      {fetch: session.fetch},
    );
    setArticlelist(savedUpdatedArticlelist);
  }
  
  const changeArticle = async (thing, text, headline) => {
    const articlelistUrl = getSourceUrl(articlelist);
    const articleText = setStringNoLocale(
      thing,
      schema.text,
      text,
    );
    const articleHeadline = setStringNoLocale(
      articleText,
      schema.headline,
      headline,
    );

    const updatedArticlelist = setThing(
      articlelist,
      articleHeadline,
    );
    const savedUpdatedArticlelist = await saveSolidDatasetAt(
      articlelistUrl,
      updatedArticlelist,
      {fetch: session.fetch},
    );
    setArticlelist(savedUpdatedArticlelist);
  };
  
  const articlesArray = articlelist ? getThingAll(articlelist) : [];  
  const myArticles = articlesArray.sort(byDate).map((currentValue) => {
    const identifier = getDecimal(
      currentValue,
      schema.identifier,
    );
    
    return(
      <li key={identifier} className="columns">
        <Article
          thing={currentValue}
          remove={async (thing) => await removeArticle(thing)}
          change={async (thing, text, headline) => await changeArticle(thing, text, headline)}
          webId={props.webId}
        />
      </li>
    );
  });
  
  return(
    <>
      <br/>
      <div className="columns">
        &nbsp;&nbsp;&nbsp;&nbsp;
        <div className="column is-half">
        <ul>{myArticles}</ul>
        </div>
        <div className="column is-one-quarter">
          <div className="card">
            <div className="card-content">
              <div className="notification is-warning is-light">
                This application was created in order to demonstrate how a decentralized blog could work.
              </div>
              <div className="content">
                All the data here displayed is saved in a remote Solid server, according to Solid technology.
              </div>
              <div className="content">
                This technology, created by Sir Tim Berners-Lee, allows the users to control their data.
              </div>
              <div className="content">
                If you want to have more information about this technology you can visit <a href="https://solidproject.org/">https://solidproject.org/</a>.
              </div>
              <br/>
              <br/>
              <div className="content">
                This application was developed for the thesis of Carlo Tosoni (a.a. 2020/2021), bachelor degree in computer engineering.
              </div>
            </div>
          </div>
        </div>
      </div>
      <br/>
      <br/>
      { session.info.isLoggedIn ? (
        <WriteArticles
          newArticle={(title, text) => addArticle(title, text)}
        />
      ) : (
        <>
        </>
      )}
    </>
  );
}

export default Articlelist;


function byDate(a, b) {
  const aUpdateDate = getDatetime(a, schema.dateModified);
  const bUpdateDate = getDatetime(b, schema.dateModified);
    
  const aCreatedDate = getDatetime(a, schema.dateCreated);
  const bCreatedDate = getDatetime(b, schema.dateCreated);
  
  const aDate = aUpdateDate ?? aCreatedDate;
  const bDate = bUpdateDate ?? bCreatedDate;
  
  if (bDate === null) {
    return -1;
  }
  
  if (aDate === null) {
    return 1;
  }
  
  return bDate.getTime() - aDate.getTime();
}