import SignIn from './components/SingIn';
import SignUp from './components/SignUp';
import MiniDrawer from './components/SideBar/SideBar'
import Box from '@mui/material/Box';

import {
  Routes,
  Route,
  Link,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import PageNotFound from './components/NotFound/NotFound';
import GamesList from './components/GamesList/GamesList';
import { useEffect, useState, createContext } from 'react';
import Game from './components/Game/Game';


const UserContext = createContext()

function App() {

  const [isLoggedIn, setLogIn] = useState(false);

  // const [modalOpen, setModalOpen] = React.useState(false);
  // const handleModalOpen = () => setModalOpen(true);
  // const handleModalClose = () => setModalOpen(false);

  const markAsLoggedOut = () => {
    setLogIn(false);
  }

  const markAsLoggedIn = () => {
    setLogIn(true);
  }

  // const parseJwt = (token) => {
  //   var base64Url = token.split('.')[1];
  //   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
  //       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //   }).join(''));

  //   return JSON.parse(jsonPayload);
  // }
  
  const checkAccessTokenValidity = async (token) => {
    if(!token) {
      console.log("there's no token provided")
      return false;
    }
    return fetch('/api/login/refresh/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({refresh: token}),
    })
    .then(response => {
      if(response.ok) { 
        return true;
      } else {
        throw new Error(`Something went wrong, server response status code is ${response.status}`);
      }
    })
    .catch(err => {
      console.error(err)
      return false;
    })
  }

  useEffect(() => {
    (async () => {
    let token = localStorage.getItem('jwt-refresh')
    let isValid = await checkAccessTokenValidity(token)
    setLogIn(isValid);
    })()
  }, []);

  return (
    <>
      <UserContext.Provider value={{isLoggedIn : isLoggedIn, markAsLoggedIn : markAsLoggedIn, markAsLoggedOut : markAsLoggedOut}}>
        <Box sx={{ display: 'flex', alignItemes: 'stretch', height: '100vh'}}>
          <BrowserRouter>
            
            <MiniDrawer isLoggedIn={isLoggedIn} markAsLoggedOut={markAsLoggedOut}/>
            
            <Routes>
              <Route path="/" element={ <Navigate to="/games" /> }/>
              <Route path="/games" element={<GamesList />} />
              <Route path="/signin" element={isLoggedIn ? <Navigate to="/games" /> : <SignIn markAsLoggedIn={markAsLoggedIn}/>}></Route>
              <Route path="/signup" element={isLoggedIn ? <Navigate to="/games" /> : <SignUp />}></Route>
              <Route path="/*" element={<PageNotFound />}></Route>
              <Route path="game/:game_id" element={<Game />} />
            </Routes>
          </BrowserRouter>
        </Box>
      </UserContext.Provider>
    </>
  )
}

export { App, UserContext }
