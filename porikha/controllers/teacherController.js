require('dotenv').config();
const Teacher = require('../models/teacher');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const sendAuthEmail = require('./../utils/sendAuthEmail');
const SGmail = require('@sendgrid/mail');

SGmail.setApiKey(process.env.SENDGRID_APIKEY);

exports.createTeacher = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  try {
    const { name, phoneNumber, institution, email, password } = req.body;

    const teacherCheck = await Teacher.findOne({ email });

    if (teacherCheck) {
      return res
        .status(400)
        .json({ msg: 'A teacher already exists with this email' });
    }

    const token = jwt.sign(
      { name, phoneNumber, institution, email, password },
      process.env.jwtToken,
      {
        expiresIn: '20m'
      }
    );

    // Sending Mail
    const msg = {
      to: email,
      from: {
        name: 'no-reply@porikha.com',
        email: 'shivaom1907@gmail.com'
      },
      subject: 'Email Confirmation',
      text: `
  Click on the below link to verify your email:
  ${process.env.CLIENT_URL}/teacher/activateTeacher/${token}
  `,
      html: `
  <h2>Click on the below link to verify your email: </h2>
  <a href="${process.env.CLIENT_URL}/teacher/activateTeachher/${token}">Click Here to Verify.</a>
  `
    };

    sendAuthEmail(msg);
    res.status(200).json({ msg: 'Verify your email!' });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.activateTeacher = async (req, res) => {
  const token = req.params.token;

  if (token) {
    jwt.verify(token, process.env.jwtToken, async (err, decodedToken) => {
      if (err) {
        return res.status(400).json({ msg: 'Incorrect or Expired link!' });
      }

      const { name, phoneNumber, institution, email, password } = decodedToken;

      try {
        let teacher = await Teacher.findOne({ email });
        if (teacher)
          return res.status(400).json({ msg: 'User already exists!' });
        let newTeacher = new Teacher({
          name,
          phoneNumber,
          institution,
          email,
          password
        });

        await newTeacher.save();
        const teacherToken = await newTeacher.generateAuthToken();
        res.status(201).json({
          msg: 'Account Activated!',
          teacher: newTeacher,
          teacherToken
        });
      } catch (error) {
        console.error(error.message);
        res
          .status(500)
          .send('Internal Server Error, during email verification!');
      }
    });
  } else {
    return res.json({ error: 'Email Not Verified!' });
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
