const router = require('express').Router()

// import controllers 
const assignmentController = require('../controllers/assignmentController')




// use routers
router.route('/').get(assignmentController.getAllAssignments);
router.route('/').post(assignmentController.addAssignment);
router.route('/:id').get(assignmentController.getOneAssignment);
router.route('/:id').put(assignmentController.updateAssignment);
router.route('/:id').delete(assignmentController.deleteAssignment);
router.route('/').all(assignmentController.handelOthers);


module.exports = router