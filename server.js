const express = require('express')
const app=express()

const cors = require('cors')

// const { loadUsersFromCSV } = require('./scripts/csvUsers');

const dbConfig = require('./config/dbConfig');

const { sequelize } = require('./models');

var corOptions ={
    origin:'https://localhost:3000'
}

const assignmentRouter = require('./routes/assignment');

app.use(cors(corOptions))

app.use(express.json())
  
app.get('/healthz', async (req, res) => {
    let client;

    try {
        res.setHeader('Cache-Control', 'no-cache, no-store');
      if (req.body && Object.keys(req.body).length > 0 || req.query && Object.keys(req.query).length > 0) {
        res.status(400).send();
      } else {
        await sequelize.authenticate();
        res.status(200).send();
      }
    } catch (error) {
      //database not available 
      res.status(503).send();
    } finally {
      if (client) {
        client.release();
      }
    }
});

app.use('/v1/assignments', assignmentRouter)

// app.all('/*', (req, res) => {
// if (req.method == 'GET') {
//     //If the url or endpoint entered is wrong
//     res.status(404).send();
// }
// else {
//     //If any other methods are used except GET
//     res.status(405).send();
// }
// });

const PORT = 3000

const server = app.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`)
})

module.exports = server;