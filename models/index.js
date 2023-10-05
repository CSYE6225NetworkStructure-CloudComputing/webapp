const dbConfig = require('../config/dbConfig.js');

const { Sequelize, DataTypes } = require('sequelize');


const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
//const db = require('../models/index'); // Assuming your models are defined in a separate file
const { builtinModules } = require('module');


const projectFile = "users.csv";
const optFile = "/opt/users.csv";


const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle

  }
}
)

sequelize.authenticate()
  .then(() => {
    console.log('connected..')
  })
  .catch(err => {
    console.log('Error' + err)
  })


const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.account = require('./accountModel')(sequelize, DataTypes)
db.assignments = require('./assignmentModel')(sequelize, DataTypes)



// db.sequelize.sync({ force: false })
// .then(() => {
//     console.log('yes re-sync done!')
// })

// Function to load data from CSV and add it to the "Account" table

async function loadCSVData() {
  try {
    await db.sequelize.sync()

    const accounts = [];
  

    let filePath = projectFile;

    // Check for the file in the /opt/ path
    if (fs.existsSync(optFile)) {
      filePath = optFile;
    }
    // Read the CSV file
    fs.createReadStream('user.csv')
      .pipe(csv())
      .on('data', async (row) => {
        // Check if the account with the same email already exists
        const existingAccount = await db.account.findOne({ where: { email: row.email } });

        const hashedPassword = await bcrypt.hash(row.password, 10);
        // If the account doesn't exist, create a new one
        if (!existingAccount) {
          const account = {
            first_name: row.first_name,
            last_name: row.last_name,
            password: hashedPassword,
            email: row.email,
            account_created: row.account_created,
            account_updated: row.account_updated,
          };

          //accounts.push(account);
          const Account = await db.account.create(account)
          console.log('Account Created')
        }

      })
      .on('end', async () => {
        // Use a transaction to ensure data consistency
        const t = await db.sequelize.transaction();

        try {
          // Bulk insert new accounts
          await db.account.bulkCreate(accounts, { transaction: t });

          // Commit the transaction
          await t.commit();
          console.log('Account data loaded successfully.');
        } catch (error) {
          // Rollback the transaction if an error occurs
          await t.rollback();
          console.error('Error loading account data:', error);
        }
      });
  } catch (error) {
    console.error('Error reading CSV file:', error);
  }
}


loadCSVData();

module.exports = db

