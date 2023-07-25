# Uniport Faculty of Computing CBT Examination Portal -- BACKEND

This project is a React.js, Node.js and MongoDB application that faciliate a Computer Based Test Portal for the students in the University of Port Harcourt's Faculty of Computing.

The student uses their matriculation number and an assigned password to login in oreder take their examintion. The lecturer (or admin) uses their username and password to upload exam questions as an excel file.

During the login the student select's the course he/she want to write. If the course is avaialbe (it has been published by the admin) he/she can start the exam and if not the exam can't be taken. The student also sees their exam scores immediately they submit their exam or their time runs out.

The lecturer (or admin) is able to see every score of the user and download an excel file that holds the data for result uploading

## Installation

1. Clone the repository down to your local machine
   `git clone -b cbt-backend https://github.com/Tammibriggs/university-cbt.git`

2. Change directory to the `project` directory\
   `cd university-cbt`

4. Install dependencies based on your package manager\
   `npm install`

7. Create a MongoDB database via the cloud-based service. Make a note of the URL for the connection.

8. Create a `.env` file and supply the environment variables defined in the .env.example file.

## Usage

To start the application, run the following command: `npm run dev`.\
The application will be available at <http://localhost:PORT>. Replace PORT with the port you are working on.

## License

This project is licensed under the **[MIT License](https://mit-license.org/)**

## Resources

- [Node.js](nodejs.org) - Official website for Node.js
- [React.js](react.dev) = Official website for React.js
- [NPM](npmjs.com) - Official website for NPM
- [Express.js](expressjs.com) - Official website for Express.js
- [MongoDB](mongodb.com) - Official website for MongoDB
- [Mongoose.js](mongoosejs.com) - Official website for Mongoose
