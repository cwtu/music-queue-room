import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {Grid, Button, Typography} from "@mui/material";
import CreateRoomPage from './CreateRoomPage';
import MusicPlayer from './MusicPlayer';

const Room = ({ leaveRoomCallback }) => {
  const [state, setState] = React.useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
		showSettings: false,
		spotifyAuthenticated: false,
		song: {}
  });
  const { roomCode } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
		getRoomDetails();

		const interval = setInterval(getCurrentSong, 1000);
		return () => clearInterval(interval);
	}, []);
	// console.log(state)


  function getRoomDetails() {
    fetch("/api/get-room/" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          leaveRoomCallback();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setState(prevState => {
					return {
						...prevState,
						votesToSkip: data.votes_to_skip,
						guestCanPause: data.guest_can_pause,
						isHost: data.is_host,
					};
        });
				if (data.is_host) {
          authenticateSpotify();
        }
			});
  }

	function authenticateSpotify() {
		fetch('/spotify/is-authenticated')
		.then((response) => response.json())
		.then((data) => {
			setState(prevState => {
				return {...prevState, spotifyAuthenticated: data.status}
			});
			if (!data.status) {
				fetch('/spotify/get-auth-url')
				.then(response => response.json())
				.then(data => {
					window.location.replace(data.url);
				})
			}
		})
	}

	function getCurrentSong() {
		fetch('/spotify/current-song')
		.then(response => {
			if (!response.ok) {
				leaveRoomCallback();
        navigate("/");
			} 
			return response.json();
		}).then(data => {
			setState(prevState => {
				return {...prevState, song: data}
			});
		})
	}


  function leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((response) => {
      leaveRoomCallback();
      navigate("/");
    });
  }

	function renderSettings() {
		return (
			<Grid container spacing={1} >
				<Grid item xs={12} align="center">
					<CreateRoomPage 
						update={true} 
						votesToSkip={state.votesToSkip} 
						guestCanPause={state.guestCanPause} 
						roomCode={roomCode} 
						updateCallback={getRoomDetails} />

				</Grid>
				<Grid item xs={12} align="center">
					<Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)} >
						Close
					</Button>
				</Grid>
				<Grid item xs={12} align="center"></Grid>
			</Grid>
		) 
	}

	function updateShowSettings(value) {
		setState({...state, showSettings: value});
	}

	function renderSettingsButton() {
		return (
			<Grid item xs={12} align="center">
				<Button variant="contained" color="primary" onClick={() => updateShowSettings(true)} >
					Settings
				</Button>
			</Grid>
		)
	}

  return (
		state.showSettings ?
			renderSettings() :
			(<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<Typography variant="h4" component="h4">
						Code: {roomCode}
					</Typography>
				</Grid>

				<MusicPlayer {...state.song} />

				{/* <Grid item xs={12} align="center">
					<Typography variant="h6" component="h6">
						Votes: {state.votesToSkip}
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<Typography variant="h6" component="h6">
						Guest Can Pause: {state.guestCanPause.toString()}
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<Typography variant="h6" component="h6">
						Host: {state.isHost.toString()}
					</Typography>
				</Grid> */}
				{state.isHost ? renderSettingsButton() : null}
				<Grid item xs={12} align="center">
					<Button
						variant="contained"
						color="secondary"
						onClick={leaveButtonPressed}
					>
						Leave Room
					</Button>
				</Grid>
			</Grid>)
		
  );
};

export default Room;