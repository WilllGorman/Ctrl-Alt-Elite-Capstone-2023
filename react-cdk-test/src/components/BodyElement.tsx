import { InputGroup, Input, Button } from "reactstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";

/**
 * Page containing search functions. In event of image search, uploads image to S3 bucket.
 * @returns HTML 
 */
export default function BodyElement() {
	const bucketName = "ctrl-alt-elite-user-image-upload"; // Change this to the name of the empty S3 bucket

	const navigate = useNavigate();
	const [userFile, setUserFile] = useState<File | null>();
	const [phrase, setPhrase] = useState('');

	/**
	 * 
	 * @param userFile 
	 */
	function uploadFileToS3(userFile: File) {	
		AWS.config.update({
			accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
			secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
			region: process.env.REACT_APP_AWS_REGION,
		});
	
		const s3 = new AWS.S3();
		const key = Date.now();
	
		const params = {
			Bucket: bucketName,
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
	
	/**
	 * 
	 * @param event 
	 */
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) 
			setUserFile(file);
	}

	/**
	 * 
	 */
	const imageSelect = () => {
		if (userFile) uploadFileToS3(userFile);
	}

	/**
	 * 
	 */
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
				<li>Python Script used to compute similarities and host API.</li>
				<li>Amazon EC2 cloud service for API server deployment.</li>
				<li>Amazon S3 cloud service for webpage, image and dataset storage.</li>
				<li>Github repository to host code for collaboration and artefact handover.</li>
				<div className="text-search-div">
					<div className="col-6 float-left">
						<h2 className="div-spacing">Text Search</h2>
						<InputGroup className="phraseSearch">
							<Input placeholder="A photo of a kids bedroom" onChange={(event) => setPhrase(event.target.value)}/>
							<Button onClick={phraseSelect}>Search Phrase</Button>
							{/* OnClick actions */}
						</InputGroup>
					</div>
					<div className="col-2 div-spacing" style={{textAlign:"center", float: 'left'}}>
					<h3>or</h3>
					</div>
					<div className="col-6 float-right">
						<h2 className="div-spacing">Image Search</h2>
						<InputGroup className="imageSearch" >
							<Input type="file" accept="image/*" onChange={handleChange}/>
							<Button onClick={imageSelect}>Search Image</Button>
						</InputGroup>
							
					</div>
				</div>
			</div>
			{ userFile && (
				<div className="background-input">
					<h2>Selected Input Image:</h2>
					<img className="image-middle input-image" src={URL.createObjectURL(userFile)}/>
				</div>
			)}	
		</article>
	);
}