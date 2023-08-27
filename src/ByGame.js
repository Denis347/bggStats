import {
  Grid,
  Column,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from "@carbon/react";
import CustomDataTable from "./CustomDataTable";

const ByGame = (props) => {
  const plays = props.plays;

  const generateTable = (plays) => {
    let toReturn = [];
    let uniqueGamesArray = plays.reduce((prev, curr) => {
      const exists = prev.find(g => g.Game === curr.Game);
      if (!exists) {
        prev.push({...curr, plays: 1});
      } else {
        exists.plays = exists.plays + 1;
      }
      return prev;
    }, [])
    
    uniqueGamesArray = uniqueGamesArray.sort((a, b) => {
      return b.plays - a.plays;
    });

    uniqueGamesArray.map((p) => {
      toReturn.push({
        id: p.GameId,
        Game: p.Game,
        GameId: p.GameId,
        Plays: p.plays,
        Percentage: Math.round(
          (parseInt(p.plays) / parseInt(plays.length)) * 100
        ),
      });
    });

    const tableHeaders = [
      { key: "Game", header: "Game" },
      { key: "Plays", header: "Plays" },
      { key: "Percentage", header: "Percentage" },
    ];
    return (
      <CustomDataTable data={toReturn} headers={tableHeaders} title="By Game" sortable={true} /> 
    );
  };

  const all = {};
  const tabsHeaders = [];
  const tabsContents = [];
  for (let i = 0; i < plays.length; i++) {
    const play = plays[i];
    let numberOfPlayers = play.Players.length;
    if (numberOfPlayers > 5) {
      numberOfPlayers = "6+";
    }
    all[numberOfPlayers] = all[numberOfPlayers] ? all[numberOfPlayers] + 1 : 1;
  }
  Object.keys(all).map((k) => {
    tabsHeaders.push(
      <Tab key={k}>
        {k} player{parseInt(k) === 1 ? "" : "s"}
      </Tab>
    );
    const filteredPlays = plays.filter(p => parseInt(p.Players.length) === parseInt(k));
    tabsContents.push(
      <TabPanel key={k}>
        {generateTable(filteredPlays)}
      </TabPanel>
    );
  });

  return (
    <Grid condensed>
      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList aria-label="Navigation" contained fullWidth>
            <Tab key="all">All player counts</Tab>
            {tabsHeaders}
          </TabList>
          <TabPanels>
            <TabPanel key="all">{generateTable(plays)}</TabPanel>
            {tabsContents}
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
};

export default ByGame;
