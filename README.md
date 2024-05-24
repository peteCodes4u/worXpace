# worXpace

## Description
This app is a command-line application for business framework data management that leverages Node.js, Inquirer, and PostgreSQL.

## Table of Contents
- [Installation Instructions](#Installation-Instructions)
- [Usage Information](#Usage-Information)
- [License](#License)
- [Contributions](#Contributions)
- [Test Instructions](#Test-Instructions)
- [Additional Questions](#additional-questions-send-an-email-or-follow-the-link-to-my-github-profile)

## Installation Instructions
In order to use this application install node.js and npm. If node.js is already installed, npm can be installed using the "npm install" command in the terminal. Once npm is installed, a user can launch the application by entering "npm start" in the command terminal. This application leverages postgres, the user must have configured postgres as a prequisite to using this app. After postgres is configured the user can update the .env file as needed for their postgres instance. After configuring the .env file the user will need to run the schema.sql script which will establish the worXpace_db database. After the database is configured the app will run as expected.

## Usage Information
The intended usage for this application is to manage business framework data with a postgres database.

![](./images/worXpace_demo.gif)

## Link to demo video
https://drive.google.com/file/d/1AJL4aMCBsFHNSds_XXORm49JAtS1j3QO/view?usp=sharing

## License
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)

## Contributions
There are no additional contributors listed.

## Test Instructions
This application can be tested manually by launching the app as detailed in the installation instructions. Users must also have installed and configured postgress inorder to run the application. Test data is provided in the seeds.sql file. Upon execution of the SQL scripts in seeds.sql file the user can evaluate and test the application following the propmts provided.

## Additional Questions? Send an email or follow the link to my github profile:
Email - peter.appliedanalyticalsciences@gmail.com 
Github profile link - https://github.com/peteCodes4u
