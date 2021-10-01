import React, { useState } from 'react';
import { LoginButton } from "@inrupt/solid-ui-react";
import ChoiceMenu from './ChoiceMenu';



function EntryArea(props) {

  const SOLID_IDENTITY_PROVIDER_DEFAULT = "https://inrupt.net/";
  const authOptions = {
      clientName: "my-solid-blog",
  };
  
  const [inputContent, setInputContent] = useState("");
  const [solidIdentityProvider, setSolidIdentityProvider] = useState(SOLID_IDENTITY_PROVIDER_DEFAULT);

  const [webId, setWebId] = useState("");

  const [decisionTaken, setDecisionTaken] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  
  const handleChange = (event) => {
    event.preventDefault();
    setInputContent(event.target.value);
  }

  const handleChangeId = (event) => {
    event.preventDefault();
    setWebId(event.target.value);
  }
  
  const changeProvider = () => {
    setSolidIdentityProvider(inputContent);
  }
  
  return (
    <div>
      { !decisionTaken ? (
        <ChoiceMenu
          decision={() => setDecisionTaken(true)}
          logging={(isLogging) => setLoggingIn(isLogging)}
        />
      ) : (
        <div>
          { loggingIn ? (
            <div>
              <p className="title">Please, connect to your pod to start</p>
              <p>Change the address of your Solid Identity Provider</p>
              <div className="columns">
                <div className="column">
                  <div className="control">
                    <input className="input is-danger is-small" list="sol-id-prov" value={inputContent} onChange={handleChange}/>
                    <datalist id="sol-id-prov">
                      <option value="https://solidcommunity.net" />
                      <option value="https://inrupt.net/" />
                    </datalist>
                  </div>
                </div>
                <div className="column">
                  <div className="control">
                    <button className="button is-warning" onClick={() => changeProvider()}>Save</button>
                  </div>
                </div>
              </div>
              <p>You are trying to connect to <a href={solidIdentityProvider} target="_blank" rel="noreferrer">{solidIdentityProvider}</a></p>
              <LoginButton
                oidcIssuer={solidIdentityProvider}
                redirectUrl={window.location.href}
                authOptions={authOptions}
              >
                <button className="button is-warning is-medium">
                  Log&nbsp;in
                </button>
              </LoginButton>
            </div>
          ) : (
            <div>
              <p className="title">Enter a valid webId</p>
              <p>Enter a webId to see the articles of the user selected</p>
              <p>You will have only read permissions</p>
              <div className="columns">
                <div className="column is-two-fifths">
                  <input className="input is-danger is-small" value={webId} onChange={handleChangeId}></input>
                </div>
                <div className="column">
                  <button className="button is-warning"
                    onClick={() => {
                      props.setWebId(webId);
                      props.entering();
                    }}
                  >
                    Enter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
  

}

export default EntryArea;
