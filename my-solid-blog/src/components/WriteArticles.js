import React, { useState } from 'react';

function WriteArticles(props) {
  const [writing, isWriting] = useState(false);
  const [titleText, setTitleText] = useState("");
  const [contentText, setContentText] = useState("");

  const handleChangeTitle = (event) => {
    event.preventDefault();
    setTitleText(event.target.value);
  }

  const handleChangeContent = (event) => {
    event.preventDefault();
    setContentText(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (contentText !== "" && titleText !== "") {
      props.newArticle(titleText, contentText);
      setContentText("");
      setTitleText("");
      event.target.reset();
    }
  };

  return(
    <div>
      &nbsp;&nbsp;&nbsp;&nbsp;
      {!writing ? (
        <button
          className="button is-medium is-warning is-light"
          onClick={() => isWriting(!writing)}
        >
          Write a new article
        </button>
      ) : (
        <div className="column is-one-quarter">
          <p>Write the title here</p>
          <form onSubmit={handleSubmit}>
            <textarea
              className="textarea is-warning"
              rows="2"
              onChange={handleChangeTitle}
            >
            </textarea>
            <p>Write the content here</p>
            <textarea
              className="textarea is-warning"
              rows="5"
              onChange={handleChangeContent}
            >
            </textarea>
            <br/>
            <button
              className="button is-danger is-light"           
              onClick={() => isWriting(!writing)}
            >Cancel</button>
            <span>&nbsp;&nbsp;</span>
            <button 
              type="submit"  
              className="button is-warning is-light"        
            >Save</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default WriteArticles;