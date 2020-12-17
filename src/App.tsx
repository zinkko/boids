import React, { ReactNode, useState } from 'react';
import BoidSimulation, { SimulationConfig } from './BoidSimulation';
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
  amountOfBoids: 220,
  boidProperties: { size: 5 },
}

function App() {
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig);

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
