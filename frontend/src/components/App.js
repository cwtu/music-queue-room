import React, { Component } from "react";
import { render } from "react-dom";
import Homepage from "./Homepage";



const App = () => {
	return (
		<div className="center">
			<Homepage />
		</div>
	)
};
const appDiv = document.getElementById("app");
render(<App/>, appDiv);

export default App;

