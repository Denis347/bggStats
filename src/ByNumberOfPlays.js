import CustomDataTable from "./CustomDataTable";

const ByNumberOfPlays = (props) => {
  const plays = props.plays;
  let toReturn = [];
  let uniqueGamesArray = plays.reduce((prev, curr) => {
    const exists = prev.find((g) => g.Game === curr.Game);
    if (!exists) {
      prev.push({ ...curr, plays: 1 });
    } else {
      exists.plays = exists.plays + 1;
    }
    return prev;
  }, []);

  uniqueGamesArray = uniqueGamesArray.sort((a, b) => {
    return b.plays - a.plays;
  });

  const numberOfPlays = {};
  uniqueGamesArray.map((game) => {
    numberOfPlays[game.plays] = numberOfPlays[game.plays]
      ? numberOfPlays[game.plays] + 1
      : 1;
  });
  let numberOfPlaysArray = [];
  Object.keys(numberOfPlays).map((key) => {
    numberOfPlaysArray.push({ id: key, Plays: key, Count: numberOfPlays[key] });
  });
  numberOfPlaysArray = numberOfPlaysArray.sort((a, b) => {
    return b.Plays - a.Plays;
  });


  const tableHeaders = [
    { key: "Plays", header: "Plays" },
    { key: "Count", header: "Number of Games" },
  ];
  return (
    <CustomDataTable
      data={numberOfPlaysArray}
      headers={tableHeaders}
      title="By Number Of Plays"
      sortable={true}
    />
  );
};

export default ByNumberOfPlays;
