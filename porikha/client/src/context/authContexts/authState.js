import React,{ useReducer} from 'react';
import AuthContext from './authContext';
import authReducer from './authReducer';
import axios from 'axios';
import setToken from '../../utilsClient/setToken';
import { SUCCESS_REGISTER,SUCCESS_LOGIN , FAIL_REGISTER , FAIL_LOGIN,SET_ERROR ,CLEAR_ERROR , LOG_OUT , AUTH_ERROR , SET_TEACHER} from '../types';  

const AuthState = (props) => {

    const initialState ={
        userAuth:null,
        errors:null,
        teacher:null
    }
    const [state, dispatch] = useReducer(authReducer, initialState);

    //register teacher

    const registerTeacher = async teacher =>{
      const config = {
        header: {
          'Content-Type': 'application/json'
        }
      }
       try {
         const res = await axios.post('/teacher',teacher,config)
         dispatch({
           type:SUCCESS_REGISTER,
           payload:res.data
         })
       } catch (error) {
         dispatch({
           type:FAIL_REGISTER,
           payload:error.response.data
         })
       }
    }
    //login teacher

    const loginTeacher = async loginData =>{
      const config = {
        header: {
          'Content-Type': 'application/json'
        }
      }
      try {
        const res = await axios.post('/teacher/log_in',loginData,config)
        dispatch({
          type:SUCCESS_LOGIN,
          payload:res.data
        })
      } catch (error) {
        dispatch({
          type:FAIL_LOGIN,
          payload:error.response.data
        })
      }
   }
   //log_out
   const log_out = ()=> {
       dispatch({
        type:LOG_OUT
       })
   }
  //get teacher
   const getTeacher = async ()=>{
    
    if(localStorage.token){
      setToken(localStorage.token)
    }
    try {
      const res = await axios.get('/teacher/me');
      dispatch({
        type:SET_TEACHER,
        payload:res.data.teacher
      })
    } catch (error) {
      dispatch({
        type:AUTH_ERROR,
        payload:error.response.data
      })
    }
 }
   const setError = (err)=>{
    dispatch({
      type:SET_ERROR,
      payload:{msg : err}
    })
   }  
   const clearError = ()=>{
    dispatch({
      type:CLEAR_ERROR
    })
   }
    return (
        <AuthContext.Provider
          value={{
            teacher:state.teacher,
            userAuth:state.userAuth,
            errors:state.errors,
            registerTeacher,
            loginTeacher,
            setError,
            error:state.error,
            log_out,
            clearError,
            getTeacher
          }}
        >{props.children}</AuthContext.Provider>
    )
}

export default AuthState
