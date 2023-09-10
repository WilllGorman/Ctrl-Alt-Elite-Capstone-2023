import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * TODO -> Prettying everything up
 * - Results page:
 *    - Images centered, make the whole page look pretty, maybe have extra div with lighter background to signify different objects not sure
 *    - Decide what the final format of the results page will look like and design it accordingly.
 * - Landing page:
 *    - Make everything pretty
 * - Navbar:
 *    - Format accordingly, buttons on the right and using nicer styling.
 * - Footer:
 *    - Agree with what text goes in the bottom
 * 
 * TODO -> Functionality
 * - Continue to investigate why dotenv wont work, how to work around this.
 * - Image search functionality - Upload image to bucket from app, python will retrieve this image and download it, apply image embedding and return similarities.
 * - Make changes to Brayden's Python script -> install flask_cors, relevant_cols = ["image_url"...]
 */