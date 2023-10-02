/**
 * TODO - Check URI encoding
 * TODO - Empty string handling for phrase
 */
import { InputGroup, Input, Button } from "reactstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";

export default function BodyElement() {
	const navigate = useNavigate();
	const [userFile, setUserFile] = useState<File | null>();
	const [phrase, setPhrase] = useState('');

	function uploadFileToS3(userFile: File) {
		// Store variables in .env file
	
		AWS.config.update({
			accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
			secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
			region: process.env.REACT_APP_AWS_REGION,
		});
	
		const s3 = new AWS.S3();
		const key = Date.now();
		// 1694828222494

		console.log(`This is the time to look for: ${key}`);
	
		const params = {
			Bucket: "ctrl-alt-elite-user-image-upload",
			Key: `${key}.jpg`,
			Body: userFile,
		};
	
		s3.upload(params, (error: any, data: any) => {
			if (error) {
				console.log("S3 Upload error: ", error);
			} else {
				console.log("File uploaded successfully!");
				navigate(`/result?s=image&imgName=${key}`);
			}
		});
	}
	
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) 
			setUserFile(file);
		console.log(file);
	}

	const imageSelect = () => {
		if (userFile) uploadFileToS3(userFile);
	}

	const phraseSelect = () => {
		navigate(`/result?s=text&phrase=${phrase}`);
	}
	
	return (
		<article>
			<div className="content-div background-layer">
				{/* Main container */}
				<h1>Welcome to our Artefact Home Page</h1>

				<p>Below are two machine learnt search options developed by our team of pros.</p>

				<h4>Services Used:</h4>
				<li>React templated using typscript to host the webpage structure.</li>
				<li>Python Script Personalised to communicate with AWS Lambda.</li>
				<li>Amazon EC2 cloud service for webpage deployment & managment.</li>
				<li>Amazon S3 bucket cloud service for storage image and related data.</li>
				<li>Github repository to host code for callaboration and artefact handover.</li>
				<div className="text-search-div">
					<div className="col-6 float-left">
						<h2 className="Div-Spacing">Text Search</h2>
						<InputGroup className="phraseSearch">
							<Input placeholder="A photo of a kids bedroom" onChange={(event) => setPhrase(event.target.value)}/>
							<Button onClick={phraseSelect}>Search Phrase</Button>
							{/* OnClick actions */}
						</InputGroup>
					</div>
					<div className="col-2 Div-Spacing" style={{textAlign:"center", float: 'left'}}>
					<h3>or</h3>
					</div>
					<div className="col-6 float-right">
						<h2 className="Div-Spacing">Image Search</h2>
						<InputGroup className="imageSearch" >
							<Input type="file" accept="image/*" onChange={handleChange}/>
							<Button onClick={imageSelect}>Search Image</Button>
						</InputGroup>
					</div>
				</div>
			</div>
			{ userFile && (
				<div className="background-input">
					<p>Selected Image:</p>
					<img className="image-middle imagePreview" src={URL.createObjectURL(userFile)}/>
				</div>
			)}			
		</article>
	);
}