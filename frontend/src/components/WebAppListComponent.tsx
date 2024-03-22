import React, { useState, useEffect } from 'react';

import {WebappSchema as Webapp} from '../client/models/WebappSchema';

interface WebAppListComponentProps {
    lastUpdateTime: number;
    setFocusedWebapp: (fn: (webapp: Webapp|undefined) => Webapp|undefined) => void;
    setLastUpdateTime: (fn: (num: number) => number) => void;
}


const setWebappState = async (app_id: number, start: boolean=true) => {
  return await fetch(`/api/apps/${app_id}/${start?'start':'stop'}`, {method: 'PUT'}).then(r => r.json());
};
const startWebapp = async (app_id: number) => setWebappState(app_id, true);
const stopWebapp = async (app_id: number) => setWebappState(app_id, false);

interface WebAppItemComponentProps {
  webapp: Webapp;
  setFocusedWebapp: (fn: (webapp: Webapp|undefined) => Webapp|undefined) => void;
  doStartWebapp: (app_id: number) => void;
  doStopWebapp: (app_id: number) => void;
}

const WebAppItemComponent: React.FC<WebAppItemComponentProps> = ({webapp, setFocusedWebapp, doStartWebapp, doStopWebapp}) => {
  const [editing, setEditing] = useState(false);
  const [newUrl, setNewUrl] = useState(webapp.url);
  const name = webapp.url ? <a href={webapp.url}>{webapp.name}</a> : webapp.name;
  const saveWebapp = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/apps/${webapp.id}`, {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({url: newUrl, name: webapp.name})}).then(r=>r.json()).then(() => {
      setEditing(false);
      setFocusedWebapp(a=>a);
    });
  };
  return (
      <li key={webapp.id}>
        <button onClick={() => setFocusedWebapp(_=>webapp)}>Focus</button>
        <button onClick={() => doStartWebapp(webapp.id)}>Start</button>
        <button onClick={() => doStopWebapp(webapp.id)}>Stop</button>
        {editing?
          <form onSubmit={saveWebapp}>
            <button onClick={saveWebapp}>Save</button>
            <input type="text" value={newUrl||""} onChange={e => setNewUrl(e.target.value)} />
          </form>:
          <button onClick={() => setEditing(true)}>Edit</button>
        }
        {name} - Status: {webapp.status}, Started: {new Date(webapp.start_time * 1000).toLocaleString()}
      </li>
  );
};

const WebAppListComponent: React.FC<WebAppListComponentProps> = ({lastUpdateTime, setLastUpdateTime, setFocusedWebapp}) => {
  const [webapps, setWebapps] = useState<Webapp[]>([]);

  const doStartWebapp = (app_id: number) => {
    startWebapp(app_id);
    setLastUpdateTime(n=>n+1);
  };
  const doStopWebapp = (app_id: number) => {
    stopWebapp(app_id);
    setLastUpdateTime(n=>n+1);
  };

  useEffect(() => {
    const fetchWebapps = async () => {
      try {
        const response = await fetch('/api/apps');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const webapps: Webapp[] = await response.json();
        setWebapps(webapps);
      } catch (error) {
        console.error('Failed to fetch webapps:', error);
      }
    };

    fetchWebapps();
  }, [lastUpdateTime]);

  return (
    <div>
      <h2>Web Apps</h2>
      <ul>
        {webapps.map((webapp) => <WebAppItemComponent
          key={webapp.id}
          webapp={webapp}
          setFocusedWebapp={setFocusedWebapp}
          doStartWebapp={doStartWebapp}
          doStopWebapp={doStopWebapp}
        />)}
      </ul>
    </div>
  );
};

export default WebAppListComponent;
