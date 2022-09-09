import React from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress} from "@mui/material";
// import { PlayArrowIcon, SkipNextIcon, PauseIcon } from "@mui/icons-material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PauseIcon from "@mui/icons-material/Pause";


const MusicPlayer = (props) => {
	function skipSong() {
		const requestOptions = {
			method: "POST", 
			headers: {'Content-Type': 'application/json'},
		};
		fetch("/spotify/skip", requestOptions);
	}
	function pauseSong() {
		const requestOptions = {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
		};
		fetch("/spotify/pause", requestOptions);
	}
	function playSong() {
		const requestOptions = {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
		};
		fetch("/spotify/play", requestOptions);
	}

	return (
    <Card>
      <Grid container align="center">
        <Grid item align="center" xs={4}>
          <img src={props.image_url} height="100%" width="100%" />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {props.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {props.artist}
          </Typography>
          <div>
            <IconButton
              onClick={() => (props.is_playing ? pauseSong() : playSong())}
            >
              {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={() => skipSong()}>
              {props.votes} / {props.votes_required}
              <SkipNextIcon />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress
        variant="determinate"
        value={(props.time / props.duration) * 100}
      />
    </Card>
  );
};


export default MusicPlayer;