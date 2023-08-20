import CustomDataTable from "./CustomDataTable";

const ByPlayer = (props) => {
  const plays = props.plays;
  let toReturn = [];
  let uniquePlayersArray = plays.reduce((prev, curr) => {
    curr.Players.map((currentPlayer) => {
      const exists = prev.find((p) => p.name === currentPlayer);
      if (!exists) {
        prev.push({
          name: currentPlayer,
          plays: 1,
          games: [{ Game: curr.Game, GameId: curr.GameId, count: 1 }],
        });
      } else {
        exists.plays = exists.plays + 1;
        const gameExists = exists.games.find((g) => g.Game === curr.Game);
        if (!gameExists) {
          exists.games.push({ Game: curr.Game, GameId: curr.GameId, count: 1 });
        } else {
          gameExists.count = gameExists.count + 1;
        }
      }
    });
    return prev;
  }, []);

  uniquePlayersArray = uniquePlayersArray.sort((a, b) => {
    return b.plays - a.plays;
  });

  uniquePlayersArray.map((p) => {
    toReturn.push({
      id: p.name,
      Name: p.name,
      Plays: p.plays,
      Game: p.games.reduce((prev, curr) => {
        if (prev) {
          if (prev.count < curr.count) {
            return curr;
          } else {
            return prev;
          }
        } else {
          return curr;
        }
      }).Game,
      GameId: p.games.reduce((prev, curr) => {
        if (prev) {
          if (prev.count < curr.count) {
            return curr;
          } else {
            return prev;
          }
        } else {
          return curr;
        }
      }).GameId,
      Percentage: Math.round(
        (parseInt(p.plays) / parseInt(plays.length)) * 100
      ),
    });
  });

  const tableHeaders = [
    { key: "Name", header: "Name" },
    { key: "Plays", header: "Plays" },
    { key: "Percentage", header: "Percentage" },
    { key: "Game", header: "Top Game" },
  ];
  return (
    <CustomDataTable
      data={toReturn}
      headers={tableHeaders}
      title="By Player"
      sortable={true}
    />
  );
};

export default ByPlayer;
