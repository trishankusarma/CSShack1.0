import { STORE_EXAM , GET_EXAMS ,SEARCH_EXAM_BY_NAME , CLEAR_EXAM_BY_NAME } from '../types';

export default (state,{type,payload})=>{
   switch(type){
       case STORE_EXAM:
        return{
          ...state,
          exams:payload    
        }      
       case GET_EXAMS:
          return {
              ...state,
              correspondingExams:payload
          }
        case SEARCH_EXAM_BY_NAME :
          const reg=new RegExp(`${payload}`,'gi');
          return{
              ...state,
              search:state.correspondingExams.filter(exam=>exam.name.match(reg))
          }
        case CLEAR_EXAM_BY_NAME :
            return {
                ...state,
                search:null          
            }       
       default:
           return state;
   }
}