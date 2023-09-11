import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import { useSearchParams } from "react-router-dom";

// SET IN PRIVATE .env FILE

export default function ResultsElement() {
	// CHANGE TO WHATEVER BRAYDENS NEW EC2 STATIC IP IS PORT 8443
	var APIURL = "http://ec2-54-79-37-141.ap-southeast-2.compute.amazonaws.com:8000/api/results";
	var newURL: RequestInfo | URL;
	
	const [searchParams] = useSearchParams();
	const [images, setImages] = useState([""]);
	const [similarity, setSimilarity] = useState([]);
	const [waiting, setWaiting] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		AWS.config.update({
			accessKeyId: AWS_ACCESS_KEY,
			secretAccessKey: AWS_SECRET_KEY,
			region: AWS_REGION,
		});
		
		const searchType = searchParams.get("s");
		if (searchType === "text") {
			const searchPhrase = searchParams.get("phrase");
			newURL = `${APIURL}?searchType=text&searchPhrase=${searchPhrase}`;
		} else if (searchType === "image") {
			// image search handling here
			console.log("TBA");
			newURL = `${APIURL}?searchType=image`
		}

		fetch(newURL)
		.then((response) => {
			if (!response.ok) throw new Error("Network response not ok");
			return response.json();
		})
		.then((jsonData) => {
			// console.log("API DATA: ", jsonData);
			const parsedResultsObject = JSON.parse(jsonData.results);
			// console.log("PARSED API RESULTS: ", parsedResultsObject);
	
			const image_name = parsedResultsObject.map((entry: { image_url: any; }) => entry.image_url);
			// console.log("IMAGE NAME RAW: ", image_name);
			// console.log(imageName);
		
			const similarityNumbers = parsedResultsObject.map((entry: { cos_sim: any; }) => entry.cos_sim);
			setSimilarity(similarityNumbers);
			// console.log(similarity);

			const s3 = new AWS.S3();

			const bucketName = "ctrl-alt-elite-image-dataset";
			const filePref = "master/master/";
			 
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

	if (waiting) {
		return <div>Loading...</div>
	}

	if (error) {
		return <div>Error: {error}</div>
	}

	// Static property data for results filler content
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
			"address" : "50 Dean Parade, Lempn Tree Passage 2319",
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

	return (
		<div className="container justify-content-center">
			{images.map((img, index) => (
				<div key={index}>
					<div className="row">
						{/* Image goes here */}
						<img src={img} className="imagePreview" alt={`Image ${index + 1}`} />
						<h1>Property {index + 1} - {similarity[index]}% match to search</h1>
					</div>
					<div className="row">
						<div className="col-6">
							<h2>{propertyData[index].address}</h2>
							<h3>{propertyData[index].price}</h3>
						</div>
						<div className="col-6">
							<p>{propertyData[index].bed}</p>
							<p>{propertyData[index].bath}</p>
							<p>{propertyData[index].car}</p>
							<p>{propertyData[index].area}</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

function formatSimilarity() {

}

