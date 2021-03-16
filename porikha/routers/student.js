const express = require('express');
const router = new express.Router();

const upload = require('./../utils/upload');

const {
  uploadAnswerScript,
  getStudentDetails,
  updateStudent
} = require('./../controllers/studentController');

router
  .route('/uploadAnswerScript')
  .post(upload.single('upload_answer_script'), uploadAnswerScript);

router.route('/getStudentDetails/:_id').get(getStudentDetails);
router.route('/updateStudent/:_id').patch(updateStudent);

module.exports = router;
