import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import NavBar  from "./components/Nav";
import Footer from "./components/Footer";

import Results from "./pages/Results";
import Landing from "./pages/Landing";

function App() {
	let items = ["Home", "CoreLogic", "Qut", "React", "AWS Lambda","AWS S3 Bucket", "AWS EC2"];
	let litems = ["/", "https://www.corelogic.com.au/", "https://www.qut.edu.au/", "https://react.dev/", "https://docs.aws.amazon.com/lambda/", "https://aws.amazon.com/s3/", "https://aws.amazon.com/ec2/"]
	let imagePathCAE = "https://cdn.discordapp.com/attachments/1079967000316608545/1145651706399559820/Ctr_Alt_Elite.png?ex=6519e50b&is=6518938b&hm=aedb9363d94d15c2b20dcfabf5838fea4801031d3aa593b8208b41b4c5f04854&"
	let imagePathGit = "https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/github-512.png"
	return (
		<BrowserRouter>	
			<div className="App">
			<NavBar brandName="Ctl Alt Elite Artefact" imageSrcPathCAE={imagePathCAE} imageSrcPathGit={imagePathGit} navItems={items} linkItems={litems} />

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
