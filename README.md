# QUT Capstone 2023 - Ctrl Alt Elite

## About This App

This app by Ctrl Alt Elite is aimed to make searching for houses much easier. Users are able to search for properties based on images or features of other properties. The app features two search functionalities - a text based search, where the user can provide a brief description of the type of room they are looking for. The system will interpret this short description, and return the houses which best match the user's description. The user is also able to search for a property via an image of a room they like. The system will analyse the image and return the results sharing the most similar properties to the user's input image. For both search options, the top 4 results will be displayed, showing an image of the room in the matching property which best matches the user's search, along with the property details on the side. 



## To use this app
### Disable Protection
This project runs the API backend using HTTP protocol, while the front end uses HTTPS. Because of this, most modern web browsers will block resources from HTTP sources for safety reasons. This means that the application will be unable to communicate with the back end. To counter this, the user must disable protection on the browser. 
#### In Firefox:
1. Click the padlock icon in the address bar
2. Click 'Connection Secure'
3. Click 'Disable Protection'
4. Re-enter the URL for the website and press enter
5. You are now able to use the app with all its' features.
#### In Chrome:
1. Click the padlock icon in
2. Click 'Site Settings'
3. Scroll down to 'Allow Blocked Content' and change to 'Allow'
4. Go back to the window and select the 'Reload' button
5. Re-enter the URL for the website and press enter
6. You are now able to use the app with all its features.
### Text Search
To use the text search, enter a brief descriptor of the room you are trying to find. For example, brief descriptions such as "bright kids bedroom" or "modern wooden kitchen" will return highly accurate results, whereas specific searches are less likely to return confident matches. To search, press the search button located next to the search bar, and your results will be displayed on the page you are redirected to.
### Image Search
To use the image search feature, first make sure you have access to your search image on your device. Using the image upload bar on the right, select the image you want to search for. Confirm it is the correct image by viewing the name in the input bar, or by viewing your image underneath the bar. To search, press the search button to the right of this input box. It may take a few seconds to load once the button is pressed, so no need to click the button multiple times. You will be redirected once your photo's processing is completed, and the results will be displayed on the page.


## Running The App
### Prerequisites
- An AWS account and access to EC2, S3.
- Download [this dataset](http://web.mit.edu/torralba/www/indoor.html) - we only make use of the 'Home' folder, consisting of 4,221 images of rooms inside of a house.
- Two S3 buckets
	- One for uploading images
	- One for holding the image dataset
- Configure your AWS account to access AWS CDK
- Access to this Github repo.
### Setting AWS Account Up
#### Setting Up AWS S3 Buckets
1. Grant necessary permissions for AWS CDK, S3 Bucket, EC2.
2. Create 2 S3 Buckets
	- One to store the user's uploaded images
	- One to store the dataset images
3. In each bucket, under "Properties", add the following code to the "Cross Origin Resource Sharing"
    ```json
    [
        {
            "AllowedHeaders": [
                "*"
            ],
            "AllowedMethods": [
                "PUT",
                "POST",
                "DELETE",
                "GET"
            ],
            "AllowedOrigins": [
                "*"
            ],
            "ExposeHeaders": []
        }
    ]
    ```
4. Upload the images to the bucket dedicated for the dataset, under 'master/'.

#### Setting Up AWS EC2 Instance
1. Launch an EC2 instance using the following settings:
	- **Application and OS Images (Amazon Machine Image):** Amazon Linux 2023 AMI 64-Bit.
	- **Instance Type:** t3.large (minimum), or any instance with at least 2vCPUs and at least 8GiB of Memory.
	- **Key Pair:** Follow the instructions to create a key pair, and then select it from the drop down menu.
	- **Network Settings:** Create a security group that allows SSH traffic from any IP address.
	- **Storage:** Minimum 16GiB of gp3 storage. 
2. Launch the instance and connect using EC2 Connect.
3. Install Python 3 on the machine using:
   ``` bash
   sudo yum install python3 -y
   ```
4. Install Python packages required for the script:
   ``` bash
   pip install numpy pandas matplotlib flask flask-cors pillow datasets transformers pathlib scikit-learn boto3 dotenv
   ```
5. Create a subfolder in the home directory named "Capstone" or whatever (Note: Changing the folder from "Capstone" will require the path to be changed in the Python script).
6. In this folder, transfer the `aws-clip-script.py` file using SCP, SFTP or any other method. Create a new environment file `.env` and add the following lines, replacing the values with your AWS access key, secret key and region respectively.
   ```
   AWS_ACCESS_KEY=your-access-key
   AWS_SECRET_KEY=your-secret-key 
   AWS_REGION=your-region
   ```
7. Create a new security group for the instance. Allow all incoming TCP traffic on port 8000, save and assign to the instance.

### Setting Up The Code
1. To get started, if not already, clone this repo to your computer.
2. Navigate to the `react-cdk-test` folder, and open a terminal session.
3. Install the dependencies using:
    ``` bash
    npm install
    ```
4. Inside the `react-cdk-test` folder, create a new environment file `.env`. Inside this, add the following code, replacing the variables with your access key, secret key and region respectively:
    ``` .env
    BUILD_PATH=infra/resources/build
    REACT_APP_AWS_ACCESS_KEY=your-access-key
    REACT_APP_AWS_SECRET_KEY=your-secret-key
    REACT_APP_AWS_REGION=your-region
    ```
5. In `src/components/BodyElement.tsx`, replace the text in `const bucketName = "your-bucket-name-here"` with the name of your empty S3 bucket
6. In `src/components/BodyElement.tsx`, replace the text in the line `const bucketName = "your-bucket-name-here"` with the name of your S3 bucket containing the image dataset.

### Running The Application
1. Launch your EC2 instance. Note the Public IP Address if an Elastic IP has not been assigned. 
2. Navigate to `src/components/ResultsElement.tsx` and replace the URL in the `var APIURL = "http://ec2-13-55-201-167.ap-southeast-2.compute.amazonaws.com:8000/api/results"` with the URL to your EC2 instance. An IP address `123.45.67.89` should look like `http://ec2-123-45-67-89.ap-southeast-2.compute.amazonaws.com:8000/api/results` for example.
3. In the EC2 Instance, navigate to the directory containing the Python script. Run the following command to run the script in the background of the instance:
   ``` bash
   nohup python3 aws-clip-script.py > log.txt 2>&1 &
   ```
    Note: This step will take 15-20 minutes on a t3.large instance. This process will not  provide an indication of completion. 
4. On your computer, navigate to the `react-cdk-test` folder and open a new console.
5. Once completed, run the following command to launch your instance. This will start to deploy your instance on AWS.
   ``` bash
   npm run deploy
   ```
	After some time, the console will prompt you to confirm you wish to deploy the app. Type `y` and press enter and the app will begin deploying.
6. After completion, the console will produce a Cloudfront link, which will look like `d123456789abcd.cloudfront.net`, this is the link to your web app. Copy this link and paste it in your browser.
7. Your app is now working! Follow the instructions for disabling protection and your app will work perfectly.
### Closing The Application
1. Navigate to `react-cdk-test/infra` and open a terminal session.
2. Enter the following command:
    ``` bash
    cdk destroy
    ```
    After some time, you will be prompted confirming you wish to delete the app. Type `y` and press enter. This will delete the application from the S3 bucket.
3. In your browser, navigate to your AWS console and go to the EC2 control panel. Select 'Stop' on the running EC2 instance. This will safely close the running EC2 instance. 
