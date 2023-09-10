import React, { useEffect, useState } from "react";
import AWS from 'aws-sdk';
import { useSearchParams } from "react-router-dom";

export default function ResultsElement() {
	const [searchParams] = useSearchParams();
    const [imageURL, setImageURL] = useState('');

	const searchType = searchParams.get("s");

	

	setImageURL("https://ctrl-alt-elite-image-dataset.s3.ap-southeast-2.amazonaws.com/master/master/Bathroom+0.jpg");

	// Properties will go on a carousel.
	// The carousel item will have the image of the property displayed on front
	// Below the image, will have the dummy address of the property, as well as related property attributes
	// Clicking on the link will take you to onthehouse.com.au page of listed property
	// Clicking on the address will take you to google maps view of house.

	return (
		<div>
			<p>This is where the results will go!</p>
			<p>Button selected was: {searchType}</p>
            { imageURL && <img src={imageURL} /> }
		</div>
	);
}
