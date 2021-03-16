const mongoose = require('mongoose');
const Student = require('../models/student');

exports.uploadAnswerScript = async (req, res) => {
  try {
    const student = new Student({
      name: req.body.name,
      scholarId: req.body.scholarId,
      date: new Date().toISOString(),
      answerPaperType: req.file.mimetype,
      answerPaper: req.file.buffer,
      owner: mongoose.Types.ObjectId(req.body._id)
    });

    await student.save();

    res.status(201).json({ student: student });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

exports.getStudentDetails = async (req, res) => {
  try {
    const response = await Student.findById(req.params._id);

    if (response === null) {
      throw new Error('Unable to fetch request');
    }

    res.set('Content-Type', 'multipart/form-data');

    res.status(200).send({ student: response });
  } catch (error) {
    console.log(error.message);

    res.json({ error: 'Internal Server Error' });
  }
};
exports.updateStudent = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['status', 'marks', 'marksDistribution'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));

    if (!isValid) {
      res.json({ error: 'Invalid Updates' });
    }
    const _id = req.params._id;

    const student = await Student.findById(_id);

    if (!student) {
      res.json({ student: null, error: 'Invalid Id' });
    }

    student['status'] = req.body['status'];
    student['marks'] = req.body['marks'];

    student['marksDistribution'] = [];

    req.body['marksDistribution'].forEach((q) => {
      student['marksDistribution'] = student['marksDistribution'].concat(q);
    });

    await student.save();

    res.status(200).json({ student: student, error: null });
  } catch (error) {
    res.status(500).json({ student: null, error: 'Server Error' });
  }
};
