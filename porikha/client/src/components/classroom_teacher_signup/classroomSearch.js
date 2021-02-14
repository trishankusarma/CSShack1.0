import React,{useContext,useRef} from 'react';
import classroomContext from '../../context/classContexts/classContext';

const ClassroomSearch = () => {
  const { clearClassroom , searchClassroom} = useContext(classroomContext);
  const searchValue=useRef('');
  const handleChange=(e)=>{
      if(searchValue.current.value!==''){
           searchClassroom(e.target.value);
      }else{
          clearClassroom();
      }
  }
  return (
    <div style={{marginLeft:'50vw',transform:'translateX(-50%)',marginTop:'-50px',position:'absolute'}}>
      <input type="text" ref={searchValue} className="search" placeholder=" Search Classroom by name ..." onChange={handleChange} style={{fontSize:'1.1rem'}}/>
      <i className="fas fa-search search-icon" style={{color:'black'}} />
    </div>
  )
}

export default ClassroomSearch