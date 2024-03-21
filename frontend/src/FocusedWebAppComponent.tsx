import { useEffect, useState } from 'react';
import {WebappSchema} from './client/models/WebappSchema';
import {ProcessSchema} from './client/models/ProcessSchema';

export interface FocusedWebAppComponentProps {
  focusedWebapp: WebappSchema|undefined;
};

export const FocusedWebAppComponent: React.FC<FocusedWebAppComponentProps> = ({ focusedWebapp }) => {

  const [processes, setProcesses] = useState<ProcessSchema[]>([]);

  useEffect(() => {
    if (focusedWebapp===undefined)
      return;
    fetch(`/api/apps/${focusedWebapp.id}/processes`).then(d => d.json()).then(d => setProcesses(d));
  }, []);

  if (focusedWebapp === undefined) {
    return (<></>);
  }
  return (
    <div>
      <div>
        {focusedWebapp.id}:
        {focusedWebapp.name}:
        {focusedWebapp.start_time}:
        {focusedWebapp.status}
      </div>
      <div>
        {processes && processes.map(p => {
          return (
            <>
              {p.id}:
              {p.cwd}:
              {p.executable}:
              {p.arguments}:
              {p.start_time}:
              {p.status}
            </>
          );
        })}
      </div>
      <div>
        <NewProcessComponent />
      </div>
    </div>
  );
};

const NewProcessComponent = () => {
  const [procName, setProcName] = useState('');
  return (
    <>
    </>
  );
};