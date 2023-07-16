import * as React from 'react';
import { useState, useEffect, useContext } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { Box, Button, Divider, Grid, ListItemButton, ListSubheader } from '@mui/material';
import GarageIcon from '@mui/icons-material/Garage';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { UserContext } from '../../App';

export default function GamesList() {
  const [gamesList, setGamesList] = useState([]);

  const {isLoggedIn, markAsLoggedIn, markAsLoggedOut} = useContext(UserContext)

  const createGame = () => {
    fetch('/api/races/race/create/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem('jwt-access')}`
      },
    })
    .then(response => {
      if(response.ok) { 
        return response.json()
      }
      else {
        throw new Error(`Not logged in ${response.status}`);
      } 
    })
    .catch(async () => {
      console.log("Creating new access token")
      let access_token = await fetch('/api/login/refresh/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({refresh: localStorage.getItem('jwt-refresh')}),
      })
      .then(response => {
        if(response.ok) { 
          return response.json();
        } else {
          throw new Error(`Something went wrong, server response status code is ${response.status}`);
        }
      })
      .then(json_data => {
        return json_data['access'];
      })
      .catch(err => {
        console.error(err)
      })

      sessionStorage.setItem('jwt-access', access_token)
      
      return await fetch('/api/races/race/create/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
      })
      .then(response => {
        if(response.ok) { 
          console.log("new game was successfully created")
          return response.json()
        }
        else {
          throw new Error(`Not logged in ${response.status}`);
        } 
      })
    })
    .then(json_data => {
      console.log(json_data)
    })
  }

  useEffect(() => {
    fetch('/api/races/available/')
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        setGamesList(data);
    })
    .catch((err) => {
        console.log(err.message);
    });
      //setGamesList([{creator: "Ilya", id: "KJKSAD8979"}, {creator: "Gamers", id: "DJHFSK80980"}])
  }, []);

  

  return (
    <Box sx={{m: '2rem', width: '100%', display: 'flex', alignItems: 'stretch'}}>
      <List 
        sx={{p: 0, border: 1, borderColor: 'rgba(0, 0, 0, 0.12)', maxWidth: '1100px', width: '100%', bgcolor: 'background.paper'}}
        subheader={
          <>
           <ListSubheader /* component="h1" */ id="nested-list-subheader" sx={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}> 
            <h4>Available games</h4>
            {
            isLoggedIn
            ?
            <Button
              //size='small'
              variant="outlined"
              // variant="contained"
              sx={{ mt: 2, mb: 2 }}
              onClick={createGame}
            >
              Create game
            </Button> 
            :
            ''}
          </ListSubheader>
          <Divider />
          </>
        }
      >

        {gamesList.map((race, i) => (
          <ListItemButton key={i} divider>
            <ListItemAvatar>
              <Avatar>
                <SportsScoreIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={race.creator} secondary={race.id} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
