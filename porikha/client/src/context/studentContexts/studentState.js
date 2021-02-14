import React,{useReducer} from 'react';
import StudentReducer from './studentReducer';
import StudentContext from './StudentContext';
import axios from 'axios';
import { GET_STUDENTS , CLEAR_SEARCH_S , SEARCH_STUDENTS_NAME , SEARCH_STUDENTS_ID , CHECKED_STATUS } from '../types';

const StudentState=(props)=>{
   const initialState={
        search:null,
        studentsofExam:[],
        errors:null,
        checkedStatus:0
   }

   const [state, dispatch] = useReducer(StudentReducer, initialState);

   const getStudents = async (_id)=>{
      const res = await axios.get(`/exam/getExamDetails/${_id}`)
      dispatch({
         type:GET_STUDENTS,
         payload:res.data.students
      })      
  }

  const searchStudentName =(input)=>{
    dispatch({
      type:SEARCH_STUDENTS_NAME,
      payload:input
    })
  } 
 
  const searchStudentId =(input)=>{
    dispatch({
      type:SEARCH_STUDENTS_ID,
      payload:input
    })
  } 
  const clearStudent=()=>{
   dispatch({
     type:CLEAR_SEARCH_S
    })
   } 

   const getCheckStatus =()=>{
     dispatch({
       type:CHECKED_STATUS
     })
   }
   
   /*const updateDetailsStudent = async (_id,student)=>{
    const config ={
      header:{
        'Content-type':'application/json'
      }
    }
    try{

    const res = await axios.patch(`/student/updateStudent/${_id}`, student ,config);

    dispatch({
      type:UPDATE_DETAILS,
      payload: res.data
    })
  } catch (error) {
    dispatch({
      type:CLASSROOM_ERROR,
      payload:error.response.msg
    })  
  }
}*/

   return(
      <StudentContext.Provider
      value={{
          search:state.search,
          studentsofExam:state.studentsofExam,
          errors:state.errors,
          checkedStatus:state.checkedStatus,
          getStudents,
          searchStudentName,
          searchStudentId,
          clearStudent,
          getCheckStatus
      }} 
      >{props.children}</StudentContext.Provider>
   )
}
export default StudentState;
