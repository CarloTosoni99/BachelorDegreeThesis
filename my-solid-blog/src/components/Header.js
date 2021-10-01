import React from "react";
import { useSession, CombinedDataProvider, Text } from "@inrupt/solid-ui-react";
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

function Header(props) {
  const { session } = useSession();

  const webId = session.info.webId ? session.info.webId : props.webId;
  const trustServerUrl = "http://localhost:8081/check";

  return (
    <>
      <h2>&nbsp;&nbsp;&nbsp;&nbsp;Welcome to my-solid-blog</h2>
      <div className="columns">
        <div className="column is-two-fifths">
          <div className="card">
            <div className="card-content">
              <p>
                &nbsp;WebID:&nbsp;&nbsp;
                <a href={webId} target="_blank" rel="noreferrer">
                  {webId}
                </a>
              </p>
              <CombinedDataProvider
                datasetUrl={webId}
                thingUrl={webId}
              >
                <div className="notification is-warning is-light">
                  <div className="content has-text-weight-bold">
                    &nbsp;Name:&nbsp;
                    <Text properties={[VCARD.fn, FOAF.name]} />
                    &nbsp;&nbsp;&nbsp;&nbsp;Organization:&nbsp;
                    <Text properties={[VCARD.organization_name]} />
                    &nbsp;&nbsp;&nbsp;&nbsp;Role:&nbsp;
                    <Text properties={[VCARD.role]} />
                  </div>
                </div>
              </CombinedDataProvider>
            </div>
          </div>
        </div>
        <div className="column is-one-third">
          <div className="card">
            <div className="notification is-warning is-light">
              <p>Press the button "Check" to check the authenticity of the content posted in my-solid-blog.</p>
              <p>You can also visit this link to check the result of the control:&nbsp;&nbsp;
              <a href={trustServerUrl} target="_blank" rel="noreferrer">
                {trustServerUrl}
              </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <h2>&nbsp;&nbsp;Read my articles here</h2>
    </>
  );
}

export default Header;
