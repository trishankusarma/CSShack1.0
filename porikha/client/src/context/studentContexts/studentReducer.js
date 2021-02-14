import { GET_STUDENTS , CLEAR_SEARCH_S , SEARCH_STUDENTS_NAME , SEARCH_STUDENTS_ID , CHECKED_STATUS } from '../types';

export default (state,{type,payload})=>{
   switch(type){
        case GET_STUDENTS:
            return {
                ...state,
                studentsofExam:payload
            }
        case CHECKED_STATUS:
            return{
                ...state,
                checkedStatus:state.studentsofExam.filter(student =>student.status===true).length
            }
        case SEARCH_STUDENTS_NAME :
           const reg=new RegExp(`${payload}`,'gi');
           return{
               ...state,
               search:state.studentsofExam.filter(student=>student.name.match(reg))
           }
        case SEARCH_STUDENTS_ID :
            const regI=new RegExp(`${payload}`,'gi');
            return{
                ...state,
                search:state.studentsofExam.filter(student=>String(student.scholarId).match(regI))
            }
       case CLEAR_SEARCH_S :
           return {
               ...state,
               search:null          
           }    
        default:
            return state;
   }
}