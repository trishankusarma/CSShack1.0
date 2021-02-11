import React from 'react';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import Register from "./components/login_register/register";
import Login from "./components/login_register/login";
import Classhall from "./components/classroom_teacher_signup/classhall";
import ClassState from './context/classContexts/classState';
import AuthState from './context/authContexts/authState';
import PrivateRoute from './routes/PrivateRoute';
import setToken from './utilsClient/setToken';
import Exam from './components/exam_student_component/exam';
import Create_Exam from './components/exam/create_Exam';
import Exam_Hall from './components/exam/Exam_Hall';
import Student_Entry from './components/exam/Student_Entry';
import AppState from './context/examContexts/AppState';
import ExamDetails from './components/exam_student_details/exam';

if(localStorage.token){
  setToken(localStorage.token);
}

function App() {

  return (
    <AuthState>
        <ClassState>
          <AppState>
         <Router>
          <div>
          <Switch>
            <PrivateRoute exact path="/" component={Classhall} />
            <PrivateRoute exact path="/exam/:_id" component={Exam} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/exam/create/:_id" component={Create_Exam} />
            <Route path='/exam_hall' component={Exam_Hall} />
            <Route path='/student' component={Student_Entry}/>
            <PrivateRoute path='/exam/details/:_id' component={ExamDetails} />
          </Switch>
          </div>
         </Router>
         </AppState>
       </ClassState>
    </AuthState>
  );
}

export default App;
