import React, { useState, useEffect } from 'react';

import {WebappSchema as Webapp} from '../client/models/WebappSchema';

interface WebAppListComponentProps {
    lastUpdateTime: number;
    setFocusedWebapp: (webapp: Webapp) => void;
}


const WebAppListComponent: React.FC<WebAppListComponentProps> = ({lastUpdateTime, setFocusedWebapp}) => {
  const [webapps, setWebapps] = useState<Webapp[]>([]);

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
            {webapp.name} - Status: {webapp.status}, Started: {new Date(webapp.start_time * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebAppListComponent;
