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
			accessKeyId: AWS_ACCESS_KEY,
			secretAccessKey: AWS_SECRET_KEY,
			region: AWS_REGION,
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
			<div className="content-div">
				{/* Main container */}
				<h1>Search container</h1>
				<div className="text-search-div">
					<InputGroup className="phraseSearch">
						<Input placeholder="A photo of a kids bedroom" onChange={(event) => setPhrase(event.target.value)}/>
						<Button onClick={phraseSelect}>Search Via Phrase</Button>
						{/* OnClick actions */}
					</InputGroup>
				</div>
				<div className="col-2" style={{textAlign:"center"}}>
					<p><strong>OR</strong></p>
				</div>
                <div className="col-5">
					<InputGroup className="imageSearch" >
                    	<Input type="file" accept="image/*" onChange={handleChange}/>
						<Button onClick={imageSelect}>Search Via Image</Button>
					</InputGroup>
                </div>
			</div>
			{ userFile && (
				<div className="row">
					<div className="col">
						<p>Selected Image:</p>
						<img className="imagePreview" src={URL.createObjectURL(userFile)} alt="The image you selected"/>
					</div>
				</div>
			)}			
		</article>
	);
}