import React, { useState } from 'react';
import EntryArea from './components/EntryArea';
import MainPage from './components/MainPage';
import { useSession } from "@inrupt/solid-ui-react";
import "./utils/fontawesome";



function App() {
  const { session } = useSession();
  const [entered, setEntered] = useState(false);
  const [webId, setWebId] = useState("");
  return (
    <div>
      { !session.info.isLoggedIn && !entered ? (
        <EntryArea
          entering={() => setEntered(true)}
          setWebId={(id) => setWebId(id)}
        />       
      ) : (        
        <MainPage
          webId={webId}
        />
      )}
    </div>
  );
}

export default App;
