import React, { useEffect, useState } from "react";
import XMLParser from "react-xml-parser";
import axios from "axios";
import he from "he"
import {
  Grid,
  Column,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TabsSkeleton,
} from "@carbon/react";
import { Corn, Home, Monster } from "@carbon/icons-react";
import ByPlayer from "./ByPlayer";
import ByGame from "./ByGame";
import ByPlayerCount from "./ByPlayerCount";

const BggStats = () => {
  let params = (new URL(document.location)).searchParams;
  let user = params.get("user");
  if (!user) {
    user = "Denis347"
  }

  const [bggData, setBggData] = useState({});

  const parsePlays = (plays) => {
    const parsedPlays = [];

    for (let i = 0; i < plays.length; i++) {
      const play = plays[i];
      const date = play.attributes.date;
      const location = play.attributes.location;

      const name = play.children.find((c) => c.name === "item").attributes.name;
      const gameId = play.children.find((c) => c.name === "item").attributes.objectid;
      const players = play.children
        .find((c) => c.name === "players")
        .children.map((c) =>
          c.attributes.username ? c.attributes.username : c.attributes.name
        );

      parsedPlays.push({
        Game: he.decode(name),
        GameId: gameId,
        Date: date,
        Location: location,
        Players: players,
      });
    }
    return parsedPlays;
  };

  const getData = async () => {
    const username = user;
    const response = await axios.get(
      `https://api.geekdo.com/xmlapi2/plays?username=${username}&page=1`
    );
    const parsedData = new XMLParser().parseFromString(response.data);

    const total = parsedData.attributes?.total || 0;
    const numberOfPages = Math.ceil(total / 100);

    for (let currentPage = 2; currentPage <= numberOfPages; currentPage++) {
      const response = await axios.get(
        `https://api.geekdo.com/xmlapi2/plays?username=${username}&page=${currentPage}`
      );
      const parsedDataNextPage = new XMLParser().parseFromString(response.data);
      parsedData.children = [
        ...parsedData.children,
        ...parsedDataNextPage.children,
      ];

      parsedData.plays = parsePlays(parsedData.children);
    }
    setBggData(parsedData);
    return parsedData;
  };

  useEffect(() => {
    getData();
  }, []);

  const calculateHIndex = (plays) => {
    let hIndex = 0;
    const gamesByPlays = {};
    plays.map(play => {
      gamesByPlays[play.Game] = gamesByPlays[play.Game] ? gamesByPlays[play.Game] + 1 : 1
    })
    let gamesByPlaysArray = Object.keys(gamesByPlays).map((key) => ({
      game: key,
      plays: gamesByPlays[key]
    }));
    gamesByPlaysArray = gamesByPlaysArray.sort((a, b) => {
      return b.plays - a.plays;
    });
    for (let i = 0; i < gamesByPlaysArray.length; i++) {
      const game = gamesByPlaysArray[i];
      if (game.plays >= i+1) {
        hIndex++;
      } else {
        break;
      }
      
    }
    return hIndex;
  }
  return bggData.attributes ? (
    <Grid condensed>
      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList aria-label="Navigation" contained fullWidth>
            <Tab renderIcon={Monster}>Basic Info</Tab>
            <Tab renderIcon={Corn}>By Player Count</Tab>
            <Tab renderIcon={Home}>By Player</Tab>
            <Tab renderIcon={Home}>By Game</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>Name: {bggData.attributes?.username}</p>
              <p>Total plays: {bggData.attributes?.total}</p>
              <p>
                Unique games played:{" "}
                {
                  bggData.plays?.reduce(
                    (prev, curr) =>
                      prev.includes(curr.Game) ? prev : [...prev, curr.Game],
                    []
                  ).length
                }
              </p>
              <p>
                H-index: { calculateHIndex(bggData.plays || []) }
              </p>
            </TabPanel>
            <TabPanel><ByPlayerCount plays={bggData.plays || []}/></TabPanel>
            <TabPanel><ByPlayer plays={bggData.plays || []}/></TabPanel>
            <TabPanel><ByGame plays={bggData.plays || []}/></TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  ) : (<Grid condensed>
    <Column lg={16} md={8} sm={4}>
      <TabsSkeleton />
    </Column></Grid>
  );
};

export default BggStats;
