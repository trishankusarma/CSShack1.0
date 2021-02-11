import { SUCCESS_REGISTER,SUCCESS_LOGIN , FAIL_REGISTER , FAIL_LOGIN, SET_ERROR, CLEAR_ERROR , LOG_OUT ,  AUTH_ERROR , SET_TEACHER} from '../types';  

export default (state,{type,payload})=>{
   switch(type){
       case SUCCESS_REGISTER:
       case SUCCESS_LOGIN:
        localStorage.setItem('token',payload.token);
        return{
            ...state,
            userAuth:true,
            errors:null,
            teacher:payload.teacher
        }
       case FAIL_REGISTER:
       case FAIL_LOGIN:
       case AUTH_ERROR:
       case LOG_OUT:
        localStorage.removeItem('token')
        return{
            ...state,
            userAuth:null,
            errors:payload
        }
       case SET_ERROR:
         return{
            ...state,
            errors:payload
         }
       case CLEAR_ERROR:
         return{
           ...state,
           errors:null
        }
       case SET_TEACHER:
          return{
            ...state,
            teacher:payload,
            erros:null
          }              
       default:
           return state;
   }
}