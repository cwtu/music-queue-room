import React from "react";
import {ThextField, Button, Grid, Typography, TextField} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";

const RoomJoinPage = () => {
	const [state, setState] = React.useState({roomCode: "", error: ""});
	const navigate = useNavigate();

	function handelTextFieldChange(e) {
		setState({...state, roomCode: e.target.value})
	}
	function roomButtonPRessed(e) {
		const requestOptions = {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				code: state.roomCode
			})
		};

		fetch('/api/join-room', requestOptions).then((response) => {
			if (response.ok) {
				navigate(`/room/${state.roomCode}`);			
			}
			else {
				setState({...state, error: "Room not found."})
			}
		}).catch(error => console.log(error))
	}

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          error={state.error}
          label="code"
          placeholder="Enter a Room Code"
          value={state.roomCode}
          helperText={state.error}
          variant="outlined"
          onChange={handelTextFieldChange}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="primary" onClick={roomButtonPRessed}>
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default RoomJoinPage;
