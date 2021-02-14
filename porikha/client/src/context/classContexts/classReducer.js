import { SEARCH_CLASSROOM , CLEAR_SEARCH, ADD_CLASSROOM, DELETE_CLASSROOM, CHANGE_IS_OPEN, EDIT_DETAILS ,CLEAR_EDIT,UPDATE_DETAILS , GET_CLASSROOM , CLASSROOM_ERROR} from '../types';

export default (state,{type,payload})=>{
   switch(type){
        case UPDATE_DETAILS:
            return{
                ...state,
                classRooms:state.classRooms.map(classRoom=>classRoom._id===payload._id ? payload : classRoom )
            }
        case CLEAR_EDIT:
            return{
                ...state,
                editDetails:null
            }
        case EDIT_DETAILS:
            return {
                ...state,
                editDetails:payload
            }
        case CHANGE_IS_OPEN:
            return {
                ...state,
                isOpen:!state.isOpen
            }
        case DELETE_CLASSROOM:
          return{
             ...state,
             classRooms:state.classRooms.filter(classRoom=>classRoom._id!==payload)
          }
       case ADD_CLASSROOM:
           return{
               ...state,
               classRooms:[...state.classRooms,payload]
           }
       case SEARCH_CLASSROOM :
           const reg=new RegExp(`${payload}`,'gi');
           return{
               ...state,
               search:state.classRooms.filter(classRoom=>classRoom.name.match(reg))
           }
       case CLEAR_SEARCH :
           return {
               ...state,
               search:null          
           }
        case GET_CLASSROOM:
            return {
                ...state,
                classRooms:payload
            }
        default:
            return state;
   }
}