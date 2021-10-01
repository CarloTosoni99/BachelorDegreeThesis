
import React, { useState } from "react";
import { 
  getStringNoLocale,
  getDatetime,
  getSolidDataset,
  getThing,
  getUrl,
  asUrl,
} from "@inrupt/solid-client";
import { schema } from 'rdf-namespaces';
import { useSession } from "@inrupt/solid-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";


function Article(props){

  const { session } = useSession();
  const webId = session.info.webId ? session.info.webId : props.webId;

  const serverUrl = "http://localhost:8081/";

  const articleDatetime = props.thing ? (
    getDatetime(
      props.thing,
      schema.dateCreated,
    )
  ) : null;

  const articleDate = articleDatetime ? new Date(articleDatetime) : null;
  let stringDate = articleDate ? (articleDate.getMonth() + 1).toString() : "";
  stringDate += articleDate ? "/" + articleDate.getDate().toString() : "";
  stringDate += articleDate ? "/" + articleDate.getFullYear().toString() : "";
  stringDate += articleDate ? " " + articleDate.getHours().toString() : "";
  stringDate += articleDate ? ":" + articleDate.getMinutes().toString() : "";

  const articleUrl = props.thing ? (
    asUrl(props.thing)
  ) : ("");

  const titleText = props.thing ? (
    getStringNoLocale(
      props.thing,
      schema.headline,
    )
  ) : ("");

  const contentText = props.thing ? (
    getStringNoLocale(
      props.thing,
      schema.text,
    )
  ) : ("");

  const [isEditing, setEditing] = useState(false);
  const [title, setTitle] = useState(titleText);
  const [content, setContent] = useState(contentText);
  const [serverResponse, setServerResponse] = useState("");
  const [readingArticleUrl, setReadingArticleUrl] = useState(false);

  const removeArticle = async () => {
    await props.remove(props.thing);
  };

  const saveArticle = async () => {
    await props.change(props.thing, content, title);
    setEditing(false);


  };

  const cancelChange = () => {
    setTitle(titleText);
    setContent(contentText);
    setEditing(false);
  }

  const setEditingTrue = () => {
    setEditing(true);
  }

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  }

  const handleChangeContent = (event) => {
    setContent(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    saveArticle();
  };

  const handleSubmitIntegrity = async (event) => {
    event.preventDefault();



    try{
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

    const podUrl = getUrl(
      profile,
      "http://www.w3.org/ns/pim/space#storage",
    );

    axios.post(
      serverUrl + "auth",
      {
        webId: webId,
        urlDataset: podUrl + "public/my-solid-blog/articlelist.ttl",
        urlThing: articleUrl,
        title: titleText,
        content: contentText,
        date: articleDate,
      },
    ).then((response) => {
      console.log(response.data);
      setServerResponse(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

    } 
    catch(e) {
      console.log(e);
    }
  };


  return(
    <>
      { !isEditing ? (
        <div>
          <br/>
          {!readingArticleUrl ? (
            <div className="column is-narrow">
              <button className="button is-ghost" onClick={() => setReadingArticleUrl(true)}>
                read article's url
              </button>
            </div>
          ) : (
            <div className="column is-narrow">
              <a href={articleUrl} target="_blank" rel="noreferrer">{articleUrl}</a>
            </div>
          )}
          <div className="columns">
            <div className="column  is-three-quarters">
              <div className="notification is-warning is-light has-text-weight-bold">
                {title}
              </div>
            </div>
            <div className="column  is-one-fifth">
              <div className="notification is-danger is-light">
                {stringDate}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="content">
                {content}
              </div>
            </div>
          </div>
          <br/>
          {session.info.isLoggedIn ? (
            <div>
              {/*Buttons for logged users*/}
              <div className="columns">
                <div className="column is-narrow">
                  <button className="button" onClick={() => setEditingTrue()}>
                    <span className="icon is-small">
                      <FontAwesomeIcon icon="pencil-alt"/>
                    </span>
                  </button>
                  <span>&nbsp;&nbsp;</span>
                  <button className="button" onClick={async () => await removeArticle()}>
                    <span className="icon is-small">
                      <FontAwesomeIcon icon="times"/>
                    </span>
                  </button>
                  <span>&nbsp;</span>
                </div>
                <div className="column is-narrow">
                  <form onSubmit={handleSubmitIntegrity}>
                    <button type="submit" className="button is-normal">
                      <span className="content">
                        Check
                      </span>
                    </button>
                  </form>
                </div>
                <div className="column is-narrow">
                  <div className="content">
                    <p>{serverResponse}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/*Buttons for users not logged*/}
              <div className="columns">
                <div className="column is-narrow">
                  <form onSubmit={handleSubmitIntegrity}>
                    <button type="submit" className="button is-normal">
                      <span className="content">
                        Check
                      </span>
                    </button>
                  </form>
                </div>
                <div className="column is-narrow">
                  <div className="content">
                    <p>{serverResponse}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <br/>
        </div>
      ) : (
        <div>
          {/*Here begins editing*/} 
          <br/>
          <form onSubmit={handleSubmit}>
            <textarea 
              className="textarea is-danger"
              onChange={handleChangeTitle}
              value={title}
              rows="2"
            >
            </textarea>
            <textarea 
              className="textarea is-warning"
              onChange={handleChangeContent}
              value={content}
              rows="5"
            >
            </textarea>
            <br/>
            <button className="button is-danger" onClick={cancelChange}>Cancel</button>
            &nbsp;
            <button type="submit" className="button is-warning">Save</button>
            &nbsp;
          </form>    
          <br/>
        </div>
      )}
    </>
  );   
}

export default Article;