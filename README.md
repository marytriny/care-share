# care_share
The CareShare web application will serve as a donation service to limit waste and help those in need. The site will allow businesses to easily donate leftover/ surplus items to organizations that redistribute to those in need. The most common items will be food as that is what most restaurants typically have a surplus of (and unfortunately usually throw away even when it is still in good condition).  The company's donating the item(s) would simply report the item, the quantity, and pickup location/ instructions. Organizations nearby would then see the item(s) available and can then choose to accept and coordinate a pickup.

# Installation
###	Install Microsoft SQL Server Express 
- I followed this tutorial for the initial setup https://youtu.be/Uh2JCSUjA_E?si=DPQW2LNexZRnjqR0 
- I called the database care-share
- Use the tableCreation.sql file in the care-share-api/database folder to create the Accounts and Donations table. 
###	Install Node.js (https://nodejs.org/en/ ) 
if you do not yet have it, as we will need npm to install dependencies and run the project.
###	Run API
- Go to the care-share-api directory (from the zip provided)
- Run: npm install
- Run: npm start
- You may need to update some of the configuration values in the database/config.js to connect to the database.
###	Run React App
- Go to the care-share directory (from the zip provided)
- Run: npm install
- Run: npm start
- Go to http://localhost:3000/ on your browser to see the app!

# User Manual
### Sign-up/ Sign-in
- Sign up using the SIGN UP button in the About Us section of the Home Page. 
- Sign in with the email and password used to sign-up. 
- Logout or update account details using the Account button on the top right of the screen.
### Donor Dashboard
- Create a donation by clicking on the Make a Donation button.
- View your donations in the Donations table. 
- Update a donation by clicking on the donation in the table. 
- Use the GENERATE CSV REPORT button to download a CSV with all donations and their status and details.
### Distributor Dashboard
- View all available donations in the Available Donations table. Use the accept button to accept.
- View all accepted donations and:
- Click on the More button to view additional details for the donation.
- Cancel to put the donation back on the Available Donations table so any other distributor may accept it instead.
- Mark a donation as Done to indicate it has been successfully collected from the Donor. 
- Use the GENERATE CSV REPORT button under the “Completed Donations” chart to download a CSV with all donations successfully completed by the organization so far.
