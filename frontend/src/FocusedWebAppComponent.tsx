import React, { useEffect, useState } from 'react';
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
        <NewProcessComponent webapp_id={focusedWebapp.id} />
      </div>
    </div>
  );
};

interface NewProcessComponentProps {
  webapp_id: number;
}
const NewProcessComponent: React.FC<NewProcessComponentProps> = ({webapp_id}) => {
  const [reload, setReload] = useState(false);
  const [processes, setProcesses] = useState<ProcessSchema[]>([]);
  const [exeName, setExeName] = useState('');
  const [args, setArgs] = useState('');
  const [cwd, setCwd] = useState('');

  useEffect(() => {
    fetch(`/api/processes/${webapp_id}`).then(r => r.json()).then(d => {
      console.log(`data: ${JSON.stringify(d)}`)
      setProcesses(d);
    })
  }, [webapp_id, reload]);

  const createNewProcess = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/processes/${webapp_id}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        executable: exeName,
        arguments: args,
        cwd: cwd,
      }),
    }).then(r => r.json()).then(() => {
      // trigger a reload of the process list
      setExeName(''); setArgs(''); setCwd('');
      setReload(!reload);
    });
  };
  return (
    <>
      <div>
        {processes.map(p => {
          return (
            <div key={p.id}>
              Process:
              {p.id}:
              {p.cwd}:
              {p.executable}:
              {p.arguments}:
              {p.start_time}:
              {p.status}
            </div>
          );
        })}
      </div>
      <form onSubmit={createNewProcess}>
        <div>New Process</div>
        <div>
          <label htmlFor='new_cwd'>Cwd</label>
          <input id='new_cwd' type='text' value={cwd} onChange={e => setCwd(e.target.value)}/>
          {cwd}
        </div>
        <div>
          <label htmlFor='new_exe_name'>Exe Path</label>
          <input id='new_exe_name' type='text' value={exeName} onChange={e => setExeName(e.target.value)}/>
          {exeName}
        </div>
        <div>
          <label htmlFor='new_args'>Args</label>
          <input id='new_args' type='text' value={args} onChange={e => setArgs(e.target.value)}/>
          {args}
        </div>
        <input type="submit" value='Submit' onSubmit={createNewProcess}/>
      </form>
    </>
  );
};