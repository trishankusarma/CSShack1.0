import React , { useReducer } from 'react';
import AppContext from './AppContext';
import AppReducer from './AppReducer';

import axios from 'axios';

import { STORE_EXAM , GET_EXAMS , SEARCH_EXAM_BY_NAME , CLEAR_EXAM_BY_NAME } from '../types';  ;

const AppState = ({children}) => {

    const initialState = {
        errors:null,
        exams:null,
        search:null,
        correspondingExams:null
    }

    const [state, dispatch] = useReducer( AppReducer, initialState );

    const storeExamDetails = async (_id) =>{

        const response = await axios.get(`/exam/getQuestionPaper/${_id}`);

        console.log(response);

        dispatch({
            type:STORE_EXAM,
            payload:response.data
        })
    }

    const getCorrespondingExams = async (_id)=>{
        const response = await axios.get(`/classroom/${_id}`);

        console.log(response);

        dispatch({
            type:GET_EXAMS,
            payload:response.data
        })
    }

    const searchExamByName =(input)=>{
        dispatch({
          type:SEARCH_EXAM_BY_NAME,
          payload:input
        })
      } 
     
      const clearExamByName=()=>{
       dispatch({
         type:CLEAR_EXAM_BY_NAME
        })
       } 
    

    return (
        <AppContext.Provider
        value={{
            errors:state.errors,
            exams:state.exams,
            correspondingExams:state.correspondingExams,
            search:state.search,
            storeExamDetails,
            getCorrespondingExams,
            searchExamByName,
            clearExamByName
        }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppState
