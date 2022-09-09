import React from "react";
import { 
	Button, 
	Grid, 
	Typography, 
	TextField, 
	FormHelperText, 
	FormControl, 
	Radio, 
	RadioGroup,
	FormControlLabel,
	Collapse 
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";




const CreateRoomPage = (props) => {
	const [state, setState] = React.useState({guestCanPause: props.guestCanPause, votesToSkip: props.votesToSkip, errorMsg: ""});
	const navigate = useNavigate();

	function handleVotesChange(e) {
		// state.votesToSkip = parseInt(e.target.value);
		setState({
			...state,
			votesToSkip: e.target.value,
		});
	}
	function handleGuestCanPauseChange (e) {
		// state.guestCanPause = e.target.value === "true" ? true : false;
    setState({
			...state, 
      guestCanPause: e.target.value === "true" ? true : false,
    });
  }

	function handleRoomButtonPressed (e) {
		const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_can_pause: state.guestCanPause,
        votes_to_skip: state.votesToSkip,
      }),
    };
		fetch("/api/create-room/", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/room/" + data.code));
	}

	function handleUpdateButtonPressed(e) {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_can_pause: state.guestCanPause,
        votes_to_skip: state.votesToSkip,
				code: props.roomCode
      }),
    };
    fetch("/api/update-room/", requestOptions)
      .then((response) => {
				if (response.ok) {
					props.updateCallback();

				} else {
					setState({
						...state,
						errorMsg : "Error updating room..."
					});
				}
			});
  }


	function renderCreateButtons() {
    return (
      <>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </>
    );
  }

	function renderUpdateButtons() {
		return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Button
        </Button>
      </Grid>
    );
	}

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={ state.errorMsg != ""}>
					{state.errorMsg}
				</Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {props.update ? "Update Room" : "Create Room"}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div algin="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={props.guestCanPause.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />

            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            defaultValue={props.votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {props.update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
};


CreateRoomPage.defaultProps = {
	votesToSkip: 5,
	guestCanPause: true,
	update: false,
	roomCode: null,
	updateCallback: () => {},
};

export default CreateRoomPage;
