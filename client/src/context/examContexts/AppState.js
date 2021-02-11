import React , { useReducer } from 'react';
import AppContext from './AppContext';
import AppReducer from './AppReducer';

import axios from 'axios';

import { STORE_EXAM } from '../types';  ;

const AppState = ({children}) => {

    const initialState = {
        errors:null,
        exams:null
    }

    const [state, dispatch] = useReducer( AppReducer, initialState );

    const storeExamDetails = async (_id) =>{

        const response = await axios.get(`/exam/getQuestionPaper/${_id}`);

        dispatch({
            type:STORE_EXAM,
            payload:response
        })
    }

    return (
        <AppContext.Provider
        value={{
            errors:state.errors,
            exams:state.exams,
            storeExamDetails
        }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppState
