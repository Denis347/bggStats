import React, { useEffect, useState } from "react";
import BggStats from "./BggStats";
import { Theme, Header, HeaderName, HeaderGlobalBar, HeaderGlobalAction } from "@carbon/react";
import { BrightnessContrast } from "@carbon/icons-react"

function App() {
  const [theme, setTheme] = useState('g90');

  return (
    <Theme theme={theme}>
      <Header aria-label="BGG Stats">
        <HeaderName href="#" prefix="BGG">
          Stats
        </HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction tooltipAlignment="end"
            aria-label="Switch theme"
            onClick={() => theme === "g90" ? setTheme("g10") : setTheme("g90")}
          >
            <BrightnessContrast size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      <div className="App" style={{ paddingTop: "100px" }}>
          <BggStats />
      </div>
    </Theme>
  );
}

export default App;
