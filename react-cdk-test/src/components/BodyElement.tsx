import { InputGroup, Input, Button } from "reactstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BodyElement() {
	const navigate = useNavigate();
	const [file, setFile] = useState<File | null>();
	
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) 
			setFile(file);
		console.log(event.target.files);
	}

	const imageSelect = () => {
		navigate("/result?s=image");
	}

	const phraseSelect = () => {
		navigate("/result?s=text");
	}
	
	return (
		<div className="container mainContainer">
			<div className="row">
				{/* Main container */}
				<h1>Search container</h1>
				<div className="col-5">
					<InputGroup className="phraseSearch">
						<Input placeholder="A photo of a kids bedroom" />
						<Button onClick={phraseSelect}>Search Via Phrase</Button>
						{/* OnClick actions */}
					</InputGroup>
				</div>
				<div className="col-2" style={{textAlign:"center"}}>
					<p><strong>OR</strong></p>
				</div>
                <div className="col-5">
                    <input type="file" accept="image/*" onChange={handleChange}/>
					<Button onClick={imageSelect}>Search Via Image</Button>
                </div>
			</div>
			{ file && (
				<div className="row">
					<div className="col">
						<p>Selected Image:</p>
						<img className="imagePreview" src={URL.createObjectURL(file)}/>
					</div>
				</div>
			)}
			
			
		</div>

		/**
		 * One container containing everything
		 *      Sub container:
		 *          contains Semantic text search and Image search boxes
		 *      Sub container with visible box:
		 *          Contains filters (area, radius, price range)
		 *          House cards - image, house info, similarity match %
		 */
	);
}
