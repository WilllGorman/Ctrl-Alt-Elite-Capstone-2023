import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import { useSearchParams } from "react-router-dom";

/**
 * Sends request to API depending on user's input from search page, retrieves results and displays on the page. 
 * @returns HTML elements displayed on the page.
 */
export default function ResultsElement() {
	// URL to the EC2 instance running the API. 
	var APIURL = "http://ec2-13-55-201-167.ap-southeast-2.compute.amazonaws.com:8000/api/results"; // Change this to your EC2 instance and the selected port. Do not remove /api/results
	const bucketName = "image-dataset-ctrl-alt-elite"; // Change this to the name of the S3 bucket holding your image dataset. 
	
	var newURL: RequestInfo | URL;
	const [searchParams] = useSearchParams();
	const [images, setImages] = useState([""]);
	const [similarity, setSimilarity] = useState([]);
	const [waiting, setWaiting] = useState(true);
	const [error, setError] = useState(null);
	
	const searchType = searchParams.get("s");
	
	// useEffect configures the AWS client to communicate with the buckets, formats API URL, fetches and formats results.
	useEffect(() => {
		// Configure AWS Client
		AWS.config.update({
			accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
			secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
			region: process.env.REACT_APP_AWS_REGION,
		});
		
		// Search formatting
		if (searchType === "text") {
			// Search type is text
			const searchPhrase = searchParams.get("phrase");
			newURL = `${APIURL}?searchType=text&searchPhrase=${searchPhrase}`;
		} else if (searchType === "image") {
			// Search type is image
			const imgName = searchParams.get("imgName");
			newURL = `${APIURL}?searchType=image&imgName=${imgName}`
		}
		
		// Send request to the formatted URL from above
		fetch(newURL)
		.then((response) => {
			// Throw error if response is not ok, else return data
			if (!response.ok) throw new Error("Network response not ok");
			return response.json();
		})
		.then((jsonData) => {
			// Parse data, retrieve images and similarities from the results.
			const parsedResultsObject = JSON.parse(jsonData.results);
			
			const image_name = parsedResultsObject.map((entry: { image_url: any; }) => entry.image_url);
			
			const similarityNumbers = parsedResultsObject.map((entry: { cos_sim: any; }) => entry.cos_sim);
			setSimilarity((similarityNumbers));
			
			// Initiate S3 Client
			const s3 = new AWS.S3();
			const filePref = "master/";
			
			// Promise all images will be returned from bucket
			Promise.all(
				image_name.map((item: string) => {
					return new Promise<string>((resolve, reject) => {
						s3.getSignedUrl("getObject", {Bucket: bucketName, Key: filePref+item}, (err, url) => {
							if (err) reject(err);
							else resolve(url);
						})
					})
				})
			)
			.then((urls) => {
				// Store images in variables, set waiting to false
				setImages(urls);
				setWaiting(false);
			})
			.catch((error) => {
				console.log("error fetching signed URLS: ", error);
				setError(error);
			})
		})
		.catch((error) => {
			console.log("Unexpected error: ", error);
			setError(error);
		});
	}, []);

	// If images have not been returned, display loading msg on screen.
	if (waiting) {
		return <div>Loading...</div>
	}

	// If an error has occured, display the error message on the screen.
	if (error) {
		return <div>Error: {error}</div>
	}

	// Static property data for results filler content.
	const propertyData = [
		{
			"address" : "36 Hydrus Street, Austral 2179",
			"price" : "$990,000",
			"bed" : "Bedrooms - 3",
			"bath" : "Bathrooms - 2",
			"car" : "Car Spaces - 1",
			"area" : "Space - 300m²"
		},
		{
			"address" : "50 Dean Parade, Lemon Tree Passage 2319",
			"price" : "$725,000",
			"bed" : "Bedrooms - 4",
			"bath" : "Bathrooms - 2",
			"car" : "Car Spaces - 1",
			"area" : "Space - 607m²"
		},
		{
			"address" : "34 Lilley Street, Spring Hill 4000",
			"price" : "$1,349,000",
			"bed" : "Bedrooms - 3",
			"bath" : "Bathrooms - 2",
			"car" : "Car Spaces - 1",
			"area" : "Space - 189m²"
		},
		{
			"address" : "8/128 Central Avenue, Indooroopilly 4068",
			"price" : "$575,000",
			"bed" : "Bedrooms - 2",
			"bath" : "Bathrooms - 2",
			"car" : "Car Spaces - 2",
			"area" : "Space - 607m²"
		}
	];

	// Results displayed nicely to the user
	return (
		<article>
			<div className="background-output">
				<h1>Search output</h1>
				{images.map((img, index) => (
					<div key={index}>
						<div className="output-result">
							{/* Image goes here */}
							<h2 className="output-title">Property {index + 1} - {formatSimilarity(similarity[index], searchType)}</h2>
							<img src={img} className="output-img" alt={`${index + 1}`} />
							<div className="output-card">
								<h5>{propertyData[index].address}</h5>
								<h6>{propertyData[index].price}</h6>
								<p>{propertyData[index].bed}</p>
								<p>{propertyData[index].bath}</p>
								<p>{propertyData[index].car}</p>
								<p>{propertyData[index].area}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</article>
	);
}

/**
 * Helper function to format the similarity level into a quantative word.
 * @param similarity The similarity of the results returned from the user's query
 * @param searchType The search type the user used for the search.
 * @returns A formatted string containing the rounded similarity and a word associated with the similarity.
 */
function formatSimilarity(similarity: number, searchType: string | null) {
	var word;
	var formattedNumber = Math.round(similarity * 10000) /100; 
	if (searchType === "image") {
		if (formattedNumber > 80) word = `High Similarity Detected`;
		else if (formattedNumber >= 50) word = `Moderate Similarity Detected`;
		else if (formattedNumber < 50) word = `Low Similarity Detected`;
	}
	else if (searchType = "text") {
		if (formattedNumber > 30) word = `High Similarity Detected`;
		else if (formattedNumber >= 25) word = `Moderate Similarity Detected`;
		else if (formattedNumber < 25) word = `Low Similarity Detected`;
	}
	return word
}