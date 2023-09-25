import React from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AWS from 'aws-sdk';

import Navigation from "./components/Nav";
import Footer from "./components/Footer";

import Results from "./pages/Results";
import Landing from "./pages/Landing";

/**
 * App() acts as a collector for all other items and elements. All elements being displayed on the page are done so from here.
 * @returns HTML elements for the entire page.
 */

function App() {
	return (
		<BrowserRouter>	
			<div className="App">
				<Navigation />

				<Routes>
					<Route path="/" element={<Landing />}/> 
					<Route path="/result" element={<Results />} />
				</Routes>

				<Footer />
			</div>
		</BrowserRouter>
	);
}

export default App;
