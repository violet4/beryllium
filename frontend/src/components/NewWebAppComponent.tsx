import React, { useState } from 'react';
import { WebappNewSchema as WebappNew } from '../client/models/WebappNewSchema';

interface NewWebAppComponentProps {
  setLastUpdateTime: (fn: (num: number) => number) => void;
}

const NewWebAppComponent: React.FC<NewWebAppComponentProps> = ({setLastUpdateTime}) => {
  const [webappName, setWebappName] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newWebapp: WebappNew = {
      name: webappName,
    };

    try {
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWebapp),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail);
      }
      setLastUpdateTime(n => n+1);

      const createdWebapp = await response.json();
      console.log('Webapp created:', createdWebapp);
      // Reset the form or provide further user feedback
      setWebappName('');
      alert('Webapp created successfully!');
    } catch (error) {
      console.error('Failed to create webapp:', error);
      alert(`Failed to create webapp:\n${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="webappName">Webapp Name:</label>
        <input
          type="text"
          id="webappName"
          value={webappName}
          onChange={(e) => setWebappName(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Webapp</button>
    </form>
  );
};

export default NewWebAppComponent;
