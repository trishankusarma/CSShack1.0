const express = require('express');
const router = new express.Router();

const upload = require('./../utils/upload');

const {
  uploadQuestionPaper,
  getExamByRoom,
  getExamDetails,
  getQuestionPaper
} = require('../controllers/examController');

router
  .route('/uploadQuestionPaper')
  .post(upload.single('upload_question_paper'), uploadQuestionPaper);

router.route('/getExamByRoom/:room').get(getExamByRoom);
router.route('/getExamDetails/:_id').get(getExamDetails);
router.route('/getQuestionPaper/:_id').get(getQuestionPaper);

module.exports = router;
