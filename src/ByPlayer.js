import CustomDataTable from "./CustomDataTable";

const ByPlayer = (props) => {
  const plays = props.plays;
  let toReturn = [];
  const uniquePlayers = {};
    for (let i = 0; i < plays.length; i++) {
      const play = plays[i];
      const players = play.Players;

      for (let p = 0; p < players.length; p++) {
        const player = players[p];
        uniquePlayers[player] = uniquePlayers[player]
          ? uniquePlayers[player] + 1
          : 1;
      }
    }
    let uniquePlayersArray = Object.keys(uniquePlayers).map((key) => ({
        name: key,
        plays: uniquePlayers[key],
      }));
      uniquePlayersArray = uniquePlayersArray.sort((a, b) => {
        return b.plays - a.plays;
      });

      uniquePlayersArray.map((p) => {
        toReturn.push({
            id: p.name,
            Name: p.name,
            Plays: p.plays,
            Percentage: Math.round((parseInt(p.plays) / parseInt(plays.length)) * 100)
          })
        }
        );
  
  const tableHeaders = [
    { key: "Name", header: "Name" },
    { key: "Plays", header: "Plays" },
    { key: "Percentage", header: "Percentage" },
  ];
  return (
    <CustomDataTable  data={toReturn} headers={tableHeaders} title="By Player" sortable={true} /> 
  );
};

export default ByPlayer;
