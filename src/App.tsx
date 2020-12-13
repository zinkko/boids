import React, { ReactNode } from 'react';
import BoidSimulation from './BoidSimulation';
import Controls from './Controls';
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

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Panel>
        <BoidSimulation />
        <Controls />
      </Panel>
    </div>
  );
}

export default App;
