const express = require('express');
const app = express();
const classroomRouter = require('./routers/classroom');
const teacherRouter = require('./routers/teacher');
const studentRouter = require('./routers/student');
const examRouter = require('./routers/exam');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/classroom', classroomRouter);
app.use('/teacher', teacherRouter);
app.use('/exam', examRouter);
app.use('/student', studentRouter);

//Serve the static assets if in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, ' client ', ' build ', 'index.html'));
  });
}

module.exports = app;
