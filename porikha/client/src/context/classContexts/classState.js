import React,{useReducer} from 'react';
import ClassReducer from './classReducer';
import ClassContext from './classContext';
import axios from 'axios';
import { SEARCH_CLASSROOM , CLEAR_SEARCH ,ADD_CLASSROOM, DELETE_CLASSROOM , CHANGE_IS_OPEN , EDIT_DETAILS ,CLEAR_EDIT , UPDATE_DETAILS , GET_CLASSROOM , CLASSROOM_ERROR} from '../types';

const ClassState=(props)=>{
   const initialState={
        isOpen:false,
        search:null,
        editDetails:null,
        classRooms:[],
        errors:null,
        classroom:null
   }
   const [state, dispatch] = useReducer(ClassReducer, initialState);

   const getClassroom = async ()=>{
     try {
       const res = await axios.get('/classroom'); 
       dispatch({
          type:GET_CLASSROOM,
          payload:res.data
       })
     } catch (error) {
        dispatch({
          type:CLASSROOM_ERROR,
          payload:error.response.msg
        })       
     }
   }

   const getClassroomById = async (_id)=>{
    // try {
      const res = await axios.get(`/classroom/${_id}`); 
      console.log(res);
    //   dispatch({
    //      type:GET_CLASSROOM_BY_ID,
    //      payload:res.data
    //   })
    // } catch (error) {
    //    dispatch({
    //      type:CLASSROOM_ERROR,
    //      payload:error.response.msg
    //    })       
    // }
   }

   const searchClassroom=(input)=>{
      dispatch({
        type:SEARCH_CLASSROOM,
        payload:input
      })
   } 
   
   const clearClassroom=()=>{
    dispatch({
      type:CLEAR_SEARCH
    })
   } 

   const add_classroom= async (classroom)=>{
     classroom ={
        name:classroom.name,
        strength:classroom.strength,
        examno:0
      }
      const config ={
        header:{
          'Content-type':'application/json'
        }
      }
      try {
       const res = await axios.post('/classroom',classroom,config);
       dispatch({
          type: ADD_CLASSROOM,
          payload:res.data
      })
      } catch (error) {
        dispatch({
          type:CLASSROOM_ERROR,
          payload:error.response.msg
        }) 
      }
}

   const delete_classroom=async (_id)=>{
     try {
       await axios.delete(`/classroom/${_id}`);
      dispatch({
        type: DELETE_CLASSROOM,
        payload:_id
      })
     } catch (error) {
      dispatch({
        type:CLASSROOM_ERROR,
        payload:error.response.msg
      })  
     }
  }
  
   const changeIsOpen=()=>{
     dispatch({
       type:CHANGE_IS_OPEN
     })
   }

   const changeEditDetails=(classroom)=>{
     dispatch({
       type:EDIT_DETAILS,
       payload:classroom
     })
   }

   const clearEditDetails=()=>{
    dispatch({
      type:CLEAR_EDIT
    })
  }

  const updateDetails=async (_id,classroom)=>{
      const config ={
        header:{
          'Content-type':'application/json'
        }
      }
      try{

      const res = await axios.patch(`/classroom/edit/${_id}`,classroom,config);

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
  }

   return(
      <ClassContext.Provider
      value={{
        classRooms: state.classRooms,
        search:state.search,
        isOpen:state.isOpen,
        editDetails:state.editDetails,
        clearClassroom,
        searchClassroom,
        add_classroom,
        delete_classroom,
        changeIsOpen,
        changeEditDetails,
        clearEditDetails,
        updateDetails,
        getClassroom,
        getClassroomById
      }} 
      >{props.children}</ClassContext.Provider>
   )
}
export default ClassState;
