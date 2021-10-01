import React from 'react';
import Header from './Header';
import Articlelist from './ArticlesList';

function MainPage(props) {
  return(
    <>
      <Header
        webId={props.webId}
      />
      <Articlelist
        webId={props.webId}
      />
      <br/>
      <p>Application developed by Carlo Tosoni</p>
      <p>Università degli studi di Perugia</p>
    </>
  );
}

export default MainPage;