const express = require('express');
const router = new express.Router();
const authentication = require('../utils/authentication');
const { check } = require('express-validator');

const {
  createClassroom,
  getAllClassroom,
  getClassroom,
  editClassroom,
  deleteClassroom
} = require('./../controllers/classroomController');

router
  .route('/')
  .post(
    authentication,
    [
      check('name', 'Please provide a name').not().isEmpty(),
      check('strength', 'Please provide a valid number').not().isEmpty()
    ],
    createClassroom
  )
  .get(authentication, getAllClassroom);

router
  .route('/:_id')
  .get(authentication, getClassroom)
  .delete(authentication, deleteClassroom);

router.route('/edit/:_id').patch(authentication, editClassroom);

module.exports = router;
