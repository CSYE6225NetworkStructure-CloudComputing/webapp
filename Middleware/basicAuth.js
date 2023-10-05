// const basicAuth = require('basic-auth');
// const bcrypt = require('bcrypt');
// const db = require('../models/index');

// // Middleware function for Basic Authentication
// const authMiddleware = async (req, res, next) => {
//   const credentials = basicAuth(req);

//   // Check if credentials are provided
//   if (!credentials || !credentials.name || !credentials.pass) {
//     return unauthorized(res);
//   }

//   try {
//     // Find the user by their username (assuming it's the email in this case)
//     const user = await db.account.findOne({ where: { first_name: credentials.name } });

//     // Check if the user exists
//     if (!user) {
//       return unauthorized(res);
//     }

//     // Debugging statements
//     console.log('User Password in DB:', user.password);
//     console.log('Password Provided:', credentials.pass);

//     // Hash the user-provided password before comparing
//     const hashedPassword = bcrypt.hashSync(credentials.pass,10);

//     console.log('Password Provided:', hashedPassword)

//     // Compare the user-provided hashed password with the hashed password from the DB
//     const passwordMatches = hashedPassword === user.password;

//     // Debugging statement
//     console.log('Password Matches:', passwordMatches);

//     if (!passwordMatches) {
//       return unauthorized(res);
//     }

//     // If authentication is successful, store the user information in the request object
//     req.user = user;

//     // If the credentials are valid, proceed to the next middleware or route handler
//     next();
//   } catch (err) {
//     console.error('Error during authentication:', err);
//     return res.status(500).send('Internal Server Error');
//   }
// };

// // Function to send an unauthorized response
// function unauthorized(res) {
//   res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//   return res.status(401).send('Unauthorized');
// }

// module.exports = authMiddleware;



