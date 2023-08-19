import React, { useEffect, useState } from "react"
import XMLParser from 'react-xml-parser'
import axios from "axios"

const DataTable = () => {
  const [bggData, setBggData] = useState([])

  const parsePlays = (plays) => {
    const parsedPlays = []

    for (let i = 0; i < plays.length; i++) {
        const play = plays[i]
        const date = play.attributes.date
        const location = play.attributes.location

        const name = play.children.find(c => c.name === "item").attributes.name
        const players = play.children.find(c => c.name === "players").children.map(c => c.attributes.username ? c.attributes.username : c.attributes.name)

        parsedPlays.push({
            "Game": name,
            "Date": date,
            "Location": location,
            "Players": players
        })
        
    }
    return parsedPlays;
  }

  const getData = async () => {
    const response = await axios.get(`https://api.geekdo.com/xmlapi2/plays?username=Denis347&page=1`)
    const parsedData = new XMLParser().parseFromString(response.data)

    const total = parsedData.attributes?.total || 0
    const numberOfPages = Math.ceil(total / 100)

    for (let currentPage = 2; currentPage <= numberOfPages; currentPage++) {
        const response = await axios.get(`https://api.geekdo.com/xmlapi2/plays?username=Denis347&page=${currentPage}`)
        const parsedDataNextPage = new XMLParser().parseFromString(response.data)
        parsedData.children = [...parsedData.children, ...parsedDataNextPage.children]

        parsedData.plays = parsePlays(parsedData.children);
    }
    setBggData(parsedData)
  }

  useEffect(() => {
    getData()
    }, [])

    const getPlayerCountPercentages = (plays) => {
        let toReturn = []
        const all = {}
        for (let i = 0; i < plays.length; i++) {
            const play = plays[i]
            const numberOfPlayers = play.Players.length
            if (numberOfPlayers > 5) {
                numberOfPlayers = '6+'
            }
            all[numberOfPlayers] = all[numberOfPlayers] ? all[numberOfPlayers] + 1 : 1
        }
        Object.keys(all).map(key => {
            toReturn.push(<p>{key + " player" + (key === '1' ? "" : "s") + ": " + all[key] + " plays (" + Math.round((parseInt(all[key]) / parseInt(plays.length)) * 100) + "%)"}</p>)
        })
        return <div>{toReturn}</div>
    }

    const getUniquePlayers = (plays) => {
        let toReturn = []
        const uniquePlayers = {}
        for (let i = 0; i < plays.length; i++) {
            const play = plays[i]
            const players = play.Players

            for (let p = 0; p < players.length; p++) {
                const player = players[p];
                uniquePlayers[player] = uniquePlayers[player] ? uniquePlayers[player] + 1 : 1
            }
        }
        let uniquePlayersArray = Object.keys(uniquePlayers).map(key => ({ "name": key, "plays": uniquePlayers[key]}) )
        uniquePlayersArray = uniquePlayersArray.sort((a, b) => {
            return b.plays - a.plays;
        });

        uniquePlayersArray.map(p => {
            toReturn.push(<p>{p.name + ": " + p.plays + " plays (" + Math.round((parseInt(p.plays) / parseInt(plays.length)) * 100) + "%)"}</p>)
        })
        
            
        return <div>{toReturn}</div>
    }
  
  return (
    bggData ? <div id="parent">
        <div id="wide">
        <p>Name: { bggData.attributes?.username }</p>
        <p>Total plays: { bggData.attributes?.total }</p>
        <p>Total children (control number, must equal Total plays): { bggData.children?.length }</p>
        <p>Unique games: { bggData.plays?.reduce((prev, curr) => prev.includes(curr.Game) ? prev : [...prev, curr.Game], []).length }</p>
        <br/>
            <h2>PLAYER COUNT</h2>
            {getPlayerCountPercentages(bggData.plays || [])}
        </div>
        <div id="wide">
            {getUniquePlayers(bggData.plays || [])}
        </div>
    </div> : <p>No data found</p>
  );
}

export default DataTable;