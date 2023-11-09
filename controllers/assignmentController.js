
const logger = require('../logging');
const db = require('../models')

const StatsD = require('node-statsd');
const statsd = new StatsD({ host: 'localhost', port: 8125 });

const { bcrypt } = require('../scripts/csvUsers')


// create main Model
const Account = db.account
const Assignment = db.assignments
const basicAuth = require('basic-auth')
// main work

// 1. get all assignments

const getAllAssignments = async (req, res) => {

    statsd.increment('api_requests.get_all_assignments');

    try {
        const cred = basicAuth(req)
        if (!cred) {
            res.status(401).end()
            logger.error('Unauthorized access'); // Log unauthorized access
            return;
        }

        const isValid = await validCred(cred);
        if (!isValid) {
            res.status(401).end();
            logger.error('Invalid credentials'); // Log invalid credentials
            return;
        }

        if (Object.keys(req.body).length > 0) {
            return res.status(400).end();
        }

        let assignments = await Assignment.findAll({
            attributes: [
                'id', 'name', 'points', 'num_of_attempts', 'deadline', 'assignment_created', 'assignment_updated', 'createdByUserId'
            ]
        })
        res.status(200).send(assignments)
        logger.info('Assignments fetched successfully'); // Log the successful retrieval


    }
    catch {

        res.status(400).end();
        logger.error('Error in getAllAssignments:', error); // Log the error
    }

}

// 2. create assignment

const addAssignment = async (req, res) => {
    statsd.increment('api_requests.create_assignment');


    try {

        
        const cred = basicAuth(req)
        if (!cred) {
            res.status(401).end()
            logger.error('Unauthorized access'); // Log unauthorized access
            return;
        }
        const isValid = await validCred(cred);

        if (!isValid) {
            res.status(401).end();
            logger.error('Invalid credentials'); // Log invalid credentials
            return;
        }
        if (Object.keys(req.query).length > 0) {
            return res.status(400).end();
        }

        // Validate the points field to ensure it's between 1 and 100

        const points = req.body.points;
        if (points < 1 || points > 10) {
            // Return a 400 Bad Request status if points are out of range
            return res.status(400).send('Points must be between 1 and 10');
        }
        const account = await getUserAccount(cred);
        const currentUserID = account.id;

        let info = {
            name: req.body.name,
            points: req.body.points,
            num_of_attempts: req.body.num_of_attempts,
            deadline: req.body.deadline,
            createdByUserId: currentUserID
        };

        // Create the assignment
        const assignment = await Assignment.create(info);

        // Return a 201 Created status with the created assignment as the response
        res.status(201).json(assignment);
        logger.info('Assignments posted successfully'); // Log the successful post


    } catch (error) {

        console.log("Error:", error)
        res.status(400).end();
        logger.error('Error in postAssignments:', error); // Log the error
    }
};


// 3. get single assignment

const getOneAssignment = async (req, res) => {

    statsd.increment('api_requests.get_one_assignment');

    try {
       
        const cred = basicAuth(req)
        if (!cred) {
            res.status(401).end()
            logger.error('Unauthorized access'); // Log unauthorized access
            return;
        }

        const isValid = await validCred(cred);

        if (!isValid) {
            res.status(401).end();
            logger.error('Invalid credentials'); // Log invalid credentials
            return;
        }



        if (Object.keys(req.body).length > 0) {
            return res.status(400).end();
        }



        // Find the assignment by its ID

        const id = req.params.id
        const assignment = await Assignment.findByPk(id);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        res.status(200).send(assignment)
        logger.info('Assignment fetched successfully'); // Log the successful retrieval

    }
    catch {

        res.status(400).end();
        logger.error('Error in getAssignment:', error); // Log the error
    }

}

// 4. update assignment


const updateAssignment = async (req, res) => {

    statsd.increment('api_requests.update_assignment');

    try {
        
        const cred = basicAuth(req)
        if (!cred) {
            res.status(401).end()
            logger.error('Unauthorized access'); // Log unauthorized access
            return;
        }

        const isValid = await validCred(cred);

        if (!isValid) {
            res.status(401).end();
            logger.error('Invalid credentials'); // Log invalid credentials
            return;
        }


        // get id of user who is updating the assignment
        const account = await getUserAccount(cred);
        if (!account) {
            res.status(401).end();
            logger.error('Invalid Account'); // Log invalid account
            return;
        }

        const currentUserID = await account.id;

        const { id } = req.params;

        // Find the assignment by its ID
        const assignment = await Assignment.findByPk(id);


        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        // if assignment is not created by current user
        if (assignment.createdByUserId !== currentUserID) {
            return res.status(403).end();
        }


        // Update assignment in the database
        const { name, points, num_of_attempts, deadline } = req.body;

        if (points > 10 || points < 1) {
            return res.status(400).json({ error: 'Invalid range for field points' });
        }
        const whereClause = {

            id: assignment.id,

        };
        await Assignment.update({
            name,
            points,
            num_of_attempts,
            deadline,
        }, { where: whereClause });

        // Update the assignment_updated field to the current time
        await Assignment.update({ assignment_updated: new Date() }, { where: whereClause });

        // get new updated assignment to send via response
        const assignmentUpdated = await Assignment.findByPk(id);
        res.status(204).json(assignmentUpdated);
        logger.info('Assignments updated successfully'); // Log the successful update


    }

    catch (error) {
        console.log("Error:", error)
        res.status(400).end();
        logger.error('Error in updateAssignment:', error); // Log the error
    }
}

// 5. delete assignment by id

const deleteAssignment = async (req, res) => {
    statsd.increment('api_requests.delete_assignment');

    try {

        const cred = basicAuth(req)
        if (!cred) {
            res.status(401).end()
            return;
        }

        const isValid = await validCred(cred);

        if (!isValid) {

            res.status(401).end();
            logger.error('Invalid credentials'); // Log invalid credentials
            return;
        }
        if (Object.keys(req.body).length > 0) {
            return res.status(400).end();
        }
        // get id of user who is updating the assignment
        const account = await getUserAccount(cred);
        if (!account) {
            res.status(401).end();
            logger.error('Invalid Account'); // Log invalid Account
            return;
        }
        const currentUserID = account.id;

        const { id } = req.params;

        // Find the assignment by its ID
        const assignment = await Assignment.findByPk(id);


        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        // if assignment is not created by current user
        if (assignment.createdByUserId !== currentUserID) {
            return res.status(403).end();
        }
        const whereClause = {
            id: assignment.id,

        };
        await assignment.destroy({ where: whereClause });

        res.status(204).end();
        logger.info('Assignment deleted successfully'); // Log the deletion


    }

    catch (error) {
        console.log("Error:", error)
        res.status(400).end();
        logger.error('Error in deleteAssignment:', error); // Log the error
    }


}

async function validCred(cred) {
    const { name, pass } = cred;
    // Find the user's hashed password based on the provided username
    const account = await Account.findOne({

        where: { email: name },
    });

    if (!account) {

        return false;
    }
    const passwordMatched = await bcrypt.compare(pass, account.password)
    // If no account found or password doesn't match, return false
    if (!passwordMatched) {
        return false;
    }
    else {
        return true;
    }
}

async function getUserAccount(cred) {
    const { name } = cred;
    const account = await Account.findOne({
        where: { email: name },
    });
    return account
}

const handelOthers = () => {

    res.status(405).end();

}

//statsd.close();

module.exports = {
    addAssignment,
    getAllAssignments,
    getOneAssignment,
    updateAssignment,
    deleteAssignment,
    handelOthers,
    statsd:statsd
}