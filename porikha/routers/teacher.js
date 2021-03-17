const express = require('express');
const router = new express.Router();

const { check } = require('express-validator');

const authentication = require('../utils/authentication');

const {
  createTeacher,
  activateTeacher,
  loginTeacher,
  logoutTeacher,
  getTeacher,
  editTeacher,
  deleteTeacher
} = require('./../controllers/teacherController');

//create teacher registration ...
router.route('/').post(
  [
    check('name', 'Please provide a name').not().isEmpty(),
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Please provide a 6 character long password').isLength({
      min: 6
    })
  ],
  createTeacher
);
router.route('/activateTeacher/:token').post(activateTeacher);

router
  .route('/log_in')
  .post(
    [
      check('email', 'Please Provide a valid Email').isEmail(),
      check('password', 'Please Provide a 6 character long password').exists()
    ],
    loginTeacher
  );

router.route('/logout').get(authentication, logoutTeacher);

router
  .route('/me')
  .get(authentication, getTeacher)
  .delete(authentication, deleteTeacher);
router.route('/edit/me').patch(authentication, editTeacher);

module.exports = router;
