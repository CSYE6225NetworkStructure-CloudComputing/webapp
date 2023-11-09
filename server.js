const express = require('express')
const app=express()
const logger = require('./logging'); 
const cors = require('cors')
const assignmentController =require('./controllers/assignmentController')
const StatsD = require('node-statsd');
const statsd = new StatsD({ host: 'localhost', port: 8125 });


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
    assignmentController.statsd.increment(`healthz.api.calls`)

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
      logger.error(`Database not available`);
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
app.all('*', (req, res) => {
  if (req.method == 'PATCH') {
    logger.warn(`Invalid request method PATCH`);
    res.status(405).end();}
  else{
    logger.warn(` Requested URL not found`);
    res.status(404).send();
  }

});

const PORT = 3000

const server = app.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`)
    logger.info(`Server is running on port 3000`);
})

module.exports = server;