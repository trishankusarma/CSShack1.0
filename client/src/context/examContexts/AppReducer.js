import { STORE_EXAM } from '../types';

export default (state,{type,payload})=>{
   switch(type){
       case STORE_EXAM:
        return{
          ...state,
          exams:payload    
        }      
       default:
           return state;
   }
}