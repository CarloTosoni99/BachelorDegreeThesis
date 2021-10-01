import React from 'react';


function ChoiceMenu(props) {
  return(
    <div>
      <p className="title">Welcome to my-solid-blog</p>
      <br/>
      <p>You can use this application by logging in with your Solid Identity Provider or by entering a valid webId of a user (without any login process)</p>
      <div className="columns">
        <div className="column is-one-quarter">
          <button className="button is-warning is-large is-fullwidth is-light"
            onClick={() => {
              props.logging(true)
              props.decision(true)
            }}
          >
            Log&nbsp;in
          </button>
        </div>
        <div className="column is-one-quarter">
          <button className="button is-danger is-large is-fullwidth is-light"
            onClick={() => {
              props.logging(false)
              props.decision(true)
            }}
          >
            Enter WebId
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChoiceMenu;