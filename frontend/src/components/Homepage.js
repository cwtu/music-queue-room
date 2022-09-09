import React from "react";
import { Grid, Button, ButtonGroup, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, } from "react-router-dom";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";

const Homepage = () => {
	const [state, setState] = React.useState({roomCode: null});
	// const navigate = useNavigate();

	React.useEffect(() => {
		fetch("/api/user-in-room")
			.then(response => response.json())
			.then(data => {
				// console.log(data);
				setState({...state, roomCode: data.code});
			})
	}, [])

	function clearRoomCode () {
		setState({...state, roomCode: null});
	}

	function renderHomePage() {
		return (
			<Grid container spacing={3}>
				<Grid item xs={12} align="center">
					<Typography variant="h3" component="h3">
						House Party
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<ButtonGroup disableElevation variant="contained" color="primary">
						<Button color="primary" to='/join' component={Link} >
							Join a Room
						</Button>
						<Button color="secondary" to='/create' component={Link} >
							Create a Room
						</Button>
					</ButtonGroup>
				</Grid>
			</Grid>
		)
	}
	return (
    <Router>
      <Routes>
        <Route
          path={"/"}
          element={
            state.roomCode
              ? <Navigate to={`/room/${state.roomCode}`}/>
            	: renderHomePage()
          }
        />
        <Route path={"/join"} element={<RoomJoinPage />} />
        <Route path={"/create"} element={<CreateRoomPage />} />
        <Route path={"/room/:roomCode"} element={<Room  leaveRoomCallback = {clearRoomCode} />} />
      </Routes>
    </Router>
  )
};


export default Homepage;