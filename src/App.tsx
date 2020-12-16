import React, { ReactNode, useState } from 'react';
import BoidSimulation from './BoidSimulation';
import Controls from './controls/Controls';
import './App.css';

function Header() {
  return (
    <div className="Header">
      <h1>Boid Simulation</h1>
    </div>
  )
}

interface PanelProps {
  children: ReactNode;
}

function Panel({ children }: PanelProps) {
  return (
    <div className="Panel">
      {children}
    </div>
  );
}

const defaultConfig = {
  amountOfBoids: 80,
}

function App() {
  const [config, setConfig] = useState(defaultConfig);

  return (
    <div className="App">
      <Header></Header>
      <Panel>
        <BoidSimulation config={config} />
        <Controls values={config} setValues={setConfig} />
      </Panel>
    </div>
  );
}

export default App;
