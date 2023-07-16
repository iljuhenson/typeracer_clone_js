import { Paper, Button, Card, CardActions, CardContent, CardMedia, TextField, Typography, Box, FormControl, Divider } from '@mui/material'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useFormControl } from '@mui/material/FormControl';
import "./disable_copy.css"
import PedalBikeOutlinedIcon from '@mui/icons-material/PedalBikeOutlined';

function Game() {
  let { game_id } = useParams();
  const [gameText, setGameText] = useState("Lorem ipsum dolor sit amet consectetur.")
  const [gameTextForDisplay, setGameTextForDisplay] = useState(gameText)
  const [typedTextToThatPoint, setTypedTextToThatPoint] = useState('')
  const [typedCharacters, setTypedCharacters] = useState('')
  const [correctlyTypedCharactersIdx, setCorrectlyTypedCharactersIdx] = useState(0)

  const [playerList, setPlayerList] = useState({})


  // const socket = new WebSocket(`/ws/race/${game_id}`);

  // socket.addEventListener("open", (event) => {
  //   socket.send("Hello Server!");
  // });


  const handlePaste = (event) => {
    event.preventDefault();
  }
  
  const changeCurrentTypedCharacters = (chars) => {
    setTypedCharacters(chars)
  }

  const compareAndFindWrongIndex = (string1, string2) => {
    for(let i = 0; i < string1.length; ++i) {
      if(string1[i] != string2[i]) {
        return [false, i]
      }
    }
    return [true, null]
  }

  const gameControlFunc = (event) => {
    changeCurrentTypedCharacters(event.target.value)
    let temp_typedTextToThatPoint = typedTextToThatPoint + event.target.value
    let temp_typedTextToThatPointLength = temp_typedTextToThatPoint.length
    let [isCorrect, index] = compareAndFindWrongIndex(gameText.slice(0, temp_typedTextToThatPointLength), temp_typedTextToThatPoint)
    
    if (!isCorrect) {
      setGameTextForDisplay("<span class=\"green\">" + gameText.slice(0, index) + "</span><span class=\"red\">" + gameText.slice(index, temp_typedTextToThatPointLength) + "</span>" + gameText.slice(temp_typedTextToThatPointLength))
      setCorrectlyTypedCharactersIdx(index)
    } else {
    
      setGameTextForDisplay("<span class=\"green\">" + gameText.slice(0, temp_typedTextToThatPointLength) + "</span>" + gameText.slice(temp_typedTextToThatPointLength))
      if(temp_typedTextToThatPoint[temp_typedTextToThatPointLength - 1] === ' ' || ((temp_typedTextToThatPoint[temp_typedTextToThatPointLength - 1] === gameText[temp_typedTextToThatPointLength - 1]) && temp_typedTextToThatPointLength === gameText.length)) {
        setTypedTextToThatPoint(temp_typedTextToThatPoint)
        setTypedCharacters('')
      }
      setCorrectlyTypedCharactersIdx(temp_typedTextToThatPointLength)
    }
  }
  
  const calculateProgress = () => {
    return correctlyTypedCharactersIdx / gameText.length
  }

  const generateRandomColorAsRgbString = () => {
    return "rgb(" + Math.floor(Math.random() * 255)
      + "," + Math.floor(Math.random() * 255) + ","
      + Math.floor(Math.random() * 255) + ")"
  }

  return (
    <Box sx={{height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
      <Paper variant='outlined' sx={{maxHeight: 600, maxWidth: 900, height: '100%', width: '100%', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center'}}>
          
          
          <Box sx={{display: 'flex', flexDirection: 'column', mt: 3}}>
            <Box sx={{}}>
              <Typography sx={{color: 'text.disabled'}}>ilyaasd</Typography>
            </Box>
            <Box sx={{display: 'flex', width:'100%'}}>
              <Box sx={{width: `${calculateProgress() * 100}%`, transition: "width 1s"}}></Box>
              <PedalBikeOutlinedIcon fontSize='large' sx={{color: generateRandomColorAsRgbString()}}/>
            </Box>
          </Box>
          <Divider />
        </Box>
        <Paper variant='outlined' sx={{p: 2, mt: 5}}><Typography><div dangerouslySetInnerHTML={{__html: gameTextForDisplay}} /></Typography></Paper>
        <FormControl>
          <TextField fullWidth id="standard-basic" label="Type here" variant="outlined" sx={{mt: 2}} onChange={gameControlFunc} onPaste={handlePaste} value={typedCharacters}/>
        </FormControl>
      </Paper> 
    
    </Box>
  )
}

export default Game
