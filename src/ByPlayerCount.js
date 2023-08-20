import CustomDataTable from "./CustomDataTable";

const ByPlayerCount = (props) => {
  const plays = props.plays;
  let toReturn = [];
  const all = {};
  for (let i = 0; i < plays.length; i++) {
    const play = plays[i];
    let numberOfPlayers = play.Players.length;
    if (numberOfPlayers > 5) {
      numberOfPlayers = "6+";
    }
    all[numberOfPlayers] = all[numberOfPlayers] ? all[numberOfPlayers] + 1 : 1;
  }
  Object.keys(all).map((key) => {
    toReturn.push({
      id: key,
      Count: key,
      Plays: all[key],
      Percentage: Math.round(
        (parseInt(all[key]) / parseInt(plays.length)) * 100
      ),
    });
  });
  const tableHeaders = [
    { key: "Count", header: "Number of players" },
    { key: "Plays", header: "Plays" },
    { key: "Percentage", header: "Percentage" },
  ];
  return (
    <CustomDataTable  data={toReturn} headers={tableHeaders} title="By Player Count" sortable={true} /> 
  );
};

export default ByPlayerCount;
