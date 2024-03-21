
import { useState } from 'react';
import {WebappSchema} from './client/models/WebappSchema';
import NewWebAppComponent from './components/NewWebAppComponent';
import WebAppListComponent from './components/WebAppListComponent';
import { FocusedWebAppComponent } from './FocusedWebAppComponent';


function App() {
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [focusedWebapp, setFocusedWebapp] = useState<WebappSchema|undefined>(undefined);

  return (
    <>
      <WebAppListComponent
        lastUpdateTime={lastUpdateTime}
        setLastUpdateTime={setLastUpdateTime}
        setFocusedWebapp={setFocusedWebapp}
      />
      <NewWebAppComponent setLastUpdateTime={setLastUpdateTime} />
      <FocusedWebAppComponent
        focusedWebapp={focusedWebapp}
        setLastUpdateTime={setLastUpdateTime}
      />
    </>
  )
}

export default App;
