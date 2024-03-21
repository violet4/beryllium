import React, { useState, useEffect } from 'react';

import {WebappSchema as Webapp} from '../client/models/WebappSchema';

interface WebAppListComponentProps {
    lastUpdateTime: number;
    setFocusedWebapp: (webapp: Webapp) => void;
    setLastUpdateTime: (fn: (num: number) => number) => void;
}


const setWebappState = async (app_name: string, start: boolean=true) => {
  return await fetch(`/api/apps/${app_name}`, {method: start?'POST':'PUT'}).then(r => r.json());
};
const startWebapp = async (app_name: string) => setWebappState(app_name, true);
const stopWebapp = async (app_name: string) => setWebappState(app_name, false);

const WebAppListComponent: React.FC<WebAppListComponentProps> = ({lastUpdateTime, setLastUpdateTime, setFocusedWebapp}) => {
  const [webapps, setWebapps] = useState<Webapp[]>([]);

  const doStartWebapp = (name: string) => {
    startWebapp(name);
    setLastUpdateTime(n=>n+1);
  };
  const doStopWebapp = (name: string) => {
    stopWebapp(name);
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
        {webapps.map((webapp) => (
          <li key={webapp.id}>
            <button onClick={() => setFocusedWebapp(webapp)}>Focus</button>
            <button onClick={() => doStartWebapp(webapp.name)}>Start</button>
            <button onClick={() => doStopWebapp(webapp.name)}>Stop</button>
            {webapp.name} - Status: {webapp.status}, Started: {new Date(webapp.start_time * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebAppListComponent;
