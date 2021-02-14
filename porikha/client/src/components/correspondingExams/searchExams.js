import React,{useContext,useRef} from 'react';
import examContext from '../../context/examContexts/AppContext';

const ExamSearch = () => {

  const { clearExamByName , searchExamByName } = useContext(examContext);
  
  const searchValue=useRef('');
  
  const handleChange=(e)=>{
  
     if(searchValue.current.value!==''){
           searchExamByName(e.target.value);
      }else{
          clearExamByName();
      }
  }
  return (
    <div >
     
      <input type="text" ref={searchValue} className="search" placeholder=" Search Exam by name ..." onChange={handleChange} style={{fontSize:'1.1rem'}}/>
     
      <i className="fas fa-search search-icon" style={{color:'black'}} />
    
    </div>
  )
}

export default ExamSearch