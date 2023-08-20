import React, { useEffect, useState } from "react";
import BggStats from "./BggStats";
import { Theme } from "@carbon/react";

function App() {
  const [theme, setTheme] = useState('g90');

  return (
    <Theme theme={theme}>
      <div className="App">
        <header className="App-header">
          <BggStats />
        </header>
      </div>
    </Theme>
  );
}

export default App;
