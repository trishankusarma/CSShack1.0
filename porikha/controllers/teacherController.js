const Teacher = require('../models/teacher');
const { validationResult } = require('express-validator');

exports.createTeacher = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  try {
    const teacherCheck = await Teacher.findOne({ email: req.body.email });

    if (teacherCheck) {
      return res
        .status(400)
        .json({ msg: 'A teacher already exists with this email' });
    }

    const teacher = new Teacher({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      institution: req.body.institution,
      email: req.body.email,
      password: req.body.password
    });
    await teacher.save();
    const token = await teacher.generateAuthToken();
    res.status(201).json({ teacher: teacher, token });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
exports.loginTeacher = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  try {
    const teacher = await Teacher.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (!teacher) {
      res.status(400).json({ msg: 'Invalid credentials' });
    }
    const token = await teacher.generateAuthToken();
    res.status(200).json({ teacher: teacher, token });
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.logoutTeacher = async (req, res) => {
  try {
    const teacher = req.teacher;
    teacher.tokens = await teacher.tokens.filter(
      (token) => token.token != req.token
    );
    await teacher.save();
    res.status(200).json({ msg: 'Successfully logged out' });
  } catch (error) {
    res.status(500).json({ msg: error.msg });
  }
};

exports.getTeacher = async (req, res) => {
  try {
    const teacher = req.teacher;
    res.status(200).json({ teacher: teacher.getPublicProfile() });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.editTeacher = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'name',
      'phoneNumber',
      'institution',
      'email',
      'password'
    ];
    const isValid = updates.every((update) => allowedUpdates.includes(update));

    if (!isValid) {
      res.status(400).json({ msg: 'Invalid Updates' });
    }
    const teacher = req.teacher;
    updates.forEach((update) => (teacher[update] = req.body[update]));
    await teacher.save();
    res.status(200).json({ teacher: teacher.getPublicProfile() });
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Errors' });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = req.teacher;
    await teacher.remove();
    res.status(200).json({ teacher: teacher.getPublicProfile() });
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
