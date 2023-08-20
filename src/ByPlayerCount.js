import CustomDataTable from "./CustomDataTable";

const ByPlayerCount = (props) => {
  const plays = props.plays;
  const user = props.user;
  let toReturn = [];
  let playerCountArray = plays.reduce((prev, curr) => {
    let numberOfPlayers = curr.Players.length;
    const exists = prev.find(
      (p) => p.Count.toString() === numberOfPlayers.toString()
    );
    if (!exists) {
      prev.push({
        Count: numberOfPlayers,
        plays: 1,
        games: [{ Game: curr.Game, GameId: curr.GameId, count: 1 }],
        players: curr.Players.map((p) => ({ name: p, count: 1 })),
      });
    } else {
      exists.plays = exists.plays + 1;

      const gameExists = exists.games.find((g) => g.Game === curr.Game);
      if (!gameExists) {
        exists.games.push({ Game: curr.Game, GameId: curr.GameId, count: 1 });
      } else {
        gameExists.count = gameExists.count + 1;
      }
      curr.Players.map((p) => {
        const playerFound = exists.players.find((n) => n.name === p);
        if (playerFound) {
          playerFound.count = playerFound.count + 1;
        } else {
          exists.players.push({ name: p, count: 1 })
        }
      });
    }
    return prev;
  }, []);

  playerCountArray = playerCountArray.sort((a, b) => {
    return a.Count - b.Count;
  });

  playerCountArray.map((p) => {
    let players = p.players;
    if (parseInt(p.Count) !== 1) {
      players = players.filter(p => p.name !== user)
    }
    toReturn.push({
      id: p.Count,
      Count: p.Count,
      Plays: p.plays,
      Percentage: Math.round(
        (parseInt(p.plays) / parseInt(plays.length)) * 100
      ),
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
      Player: players.reduce((prev, curr) => {
        if (prev) {
          if (prev.count < curr.count) {
            return curr;
          } else {
            return prev;
          }
        } else {
          return curr;
        }
      }).name,
    });
  });
  const tableHeaders = [
    { key: "Count", header: "Number of players" },
    { key: "Plays", header: "Plays" },
    { key: "Percentage", header: "Percentage" },
    { key: "Game", header: "Top Game" },
    { key: "Player", header: "Top Player" },
  ];
  return (
    <CustomDataTable
      data={toReturn}
      headers={tableHeaders}
      title="By Player Count"
      sortable={true}
    />
  );
};

export default ByPlayerCount;
