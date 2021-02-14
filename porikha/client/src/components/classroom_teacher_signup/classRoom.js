import React,{useContext} from 'react';
import {Link} from 'react-router-dom';
import classroomContext from '../../context/classContexts/classContext';

const ClassRoom = ({classRoom}) => {
    const {delete_classroom , changeIsOpen , changeEditDetails} = useContext(classroomContext);
    const {_id,name,strength,lastexam,examno}=classRoom;
    const EDIT_STYLES = {backgroundColor:'yellow',cursor:'pointer'}
    const DELETE_STYLES ={backgroundColor:'red',color:'white',cursor:'pointer'}
    const deleteClassroom=()=>{
      delete_classroom(_id);
    }
    const handleChange=()=>{
      changeIsOpen();
      changeEditDetails({_id,name,strength});
    }
    const noexam = "No Exam Till Date";
    return (
        <div>
            <div className="card">
            <Link to={`/exam/${_id}`} style={{textDecoration:"none"}}>
              <div className="subname">
                  {name}
              </div>
            </Link>
            <div className="contain" style={{fontSize:'1rem', fontFamily:'sans-serif',position:'relative'}}>
             <div style={{position:'absolute',top:0,right:0}}>
              <Link to='/'><button style={EDIT_STYLES} onClick={handleChange}>Edit</button></Link>
              <Link to='/'><button style={DELETE_STYLES} onClick={deleteClassroom}>Delete</button></Link>
             </div>
                 <h4><b>Number of students {strength}</b></h4> 
                 <span>Last Date of Exam : {lastexam===null? noexam : lastexam }</span> 
                 <p>Number of Exams taken : {examno}</p>
                 </div>
              </div>
        </div>
    )
}

export default ClassRoom;
