import React , { useEffect , useState , useContext , useRef } from "react";
import "../../css/exam.css";

import { useParams , Link } from 'react-router-dom';
import axios from 'axios';

import StudentContext from '../../context/studentContexts/StudentContext';
import Noresults from "./Noresults";
import Navbar  from '../navbar/Navbar';

const Exam=()=>{

    const { _id } = useParams();

    const [ students , setStudents ] = useState(null);

    const [ exam , setExam ] = useState(null);

    const [ studentsLength , setStudentLength ] = useState(0);

    const { getStudents , searchStudentName , searchStudentId , clearStudent , studentsofExam , search , getCheckStatus , checkedStatus } = useContext(StudentContext);

    const searchName = useRef('');
    const searchId = useRef('');

    const handleChangeName = (e)=>{

        if(searchName.current.value!==''){
            searchStudentName(e.target.value);
       }else{
           clearStudent();
       }

    }

    const handleChangeScholarId = (e)=>{

        if(searchId.current.value!==''){
            searchStudentId(e.target.value);
       }else{
           clearStudent();
       }

    }

    useEffect(async () => {
        const response = await axios.get(`/exam/getExamDetails/${_id}`);

        setExam(response.data.exam);

        setStudents(response.data.students);

        setStudentLength(response.data.students.length);

        await getCheckStatus();

        await getStudents(_id);
    }, [])

    const fontWhite = { color:'white' }

    const anchorLink = {
      color:'white',
      textDecoration:'none'
    }

    return (
        <>
            <Navbar />
            <div className="Exam">
              <h1 style={{marginLeft:'-700px',marginTop:'-50px',fontWeight:'bold'}}>The exam</h1>
              <div class="flex-container">
                 <div class="flex-item-left">
                   <input type="text" ref={searchName} placeholder="Search by name" style={fontWhite} className="search1" onChange={handleChangeName}/>
                   <input type="Number" ref={searchId} placeholder="Search by ID" style={fontWhite}  className="search2" onChange={handleChangeScholarId}/>
                   <div className="list">
                     <h2 style={{fontWeight:'bold',fontSize:'100%'}}>Student list</h2>
      
                   <table>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Checked Status</th>
                    <th>Mark</th>
                  </tr>
                  <hr></hr>
                  { search !== null ? search.length===0 ? 
                       <Noresults /> : 
                      search.map(
                        student=>(
                              <tr>
                                <Link to={`/student/getStudentDetails/${student._id}`} style={anchorLink}><td>{student.name}</td></Link> 
                                <td>{student.scholarId}</td>
                                <td>{student.status===false?'false':'true'}</td>
                                <td>{student.marks}</td>
                               </tr> 
                        )
                      ) : 
                      studentsofExam.length===0 ? 
                      <Noresults /> :
                      studentsofExam.map(
                        student=>(
                            <tr>
                              <Link to={`/student/getStudentDetails/${student._id}`} style={anchorLink}><td>{student.name}</td></Link> 
                              <td>{student.scholarId}</td>
                              <td>{student.status===false?'false':'true'}</td>
                              <td>{student.marks}</td>
                            </tr> 
                        )
                      ) 
                 }
      </table>

     </div>
  </div>
  <div class="flex-item-right">
  <div className="details">
          <h4 style={{fontWeight:'bold'}}>Exam Details</h4>
          <table>
              <tr>
                  <th>Exam date</th>
                  <th>{exam!==null ? exam.date.split("T")[0] : NaN}</th>
              </tr>
              <tr>
                  <td>Student Appreared</td>
                  <td>{studentsLength}</td>
              </tr>
          </table>
      </div>
      <div className="status">
          <h3 style={{fontWeight:'bold'}}>Check Status</h3>
          <table>
              <tr>
                  <td>Papers checked</td>
                  <td>{checkedStatus}</td>
              </tr>
              <tr>
                  <td>Papers remaining</td>
                  <td>{studentsLength - checkedStatus}</td>
              </tr>
              <textarea></textarea>
          </table>
      </div>
  </div>
</div>
            </div>
        </>)
}
export default Exam;