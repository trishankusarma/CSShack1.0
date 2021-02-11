import React , { useEffect , useState } from "react";
import "../../css/exam.css";

import { useParams } from 'react-router-dom';
import axios from 'axios';

const Exam=()=>{

    const { _id } = useParams();

    const [ students , setStudents ] = useState(null);

    const [ exam , setExam ] = useState(null);

    const [ studentsLength , setStudentLength ] = useState(0);

    useEffect(async () => {
        const response = await axios.get(`/exam/getExamDetails/${_id}`);

        setExam(response.data.exam);

        setStudents(response.data.students);

        setStudentLength(response.data.students.length);
    }, [])

    return (
        <>
            <div className="Exam">
              <h1>the exam</h1>
              <div class="flex-container">
                 <div class="flex-item-left">
                   <input type="text" placeholder="Search by name" className="search1"></input>
                   <input type="text" placeholder="Search by ID" className="search2"></input>
                   <div className="list">
                     <h2>student list</h2>
      
                   <table>
                  <tr>
                    <th>name</th>
                    <th>ID</th>
                    <th>status</th>
                    <th>mark</th>
                  </tr>
                  <hr></hr>
                  { students!==null ?
                    students.map(student=>(
                        <tr>
                          <td>{student.name}</td>
                          <td>{student.scholarId}</td>
                          <td>checked</td>
                          <td>05</td>
                        </tr> 
                    ))
                  : <tr>
                      <td>NA</td>
                      <td>NA</td>
                      <td>NA</td>
                      <td>NA</td>
               </tr> }
      </table>

     </div>
  </div>
  <div class="flex-item-right">
  <div className="details">
          <h4>Exam Details</h4>
          <table>
              <tr>
                  <th>exam date</th>
                  <th>{exam!==null ? exam.date.split("T")[0] : NaN}</th>
              </tr>
              <tr>
                  <td>student Appreared</td>
                  <td>{studentsLength}</td>
              </tr>
          </table>
      </div>
      <div className="status">
          <h3>Check Status</h3>
          <table>
              <tr>
                  <td>papers checked</td>
                  <td>30</td>
              </tr>
              <tr>
                  <td>papers checked</td>
                  <td>30</td>
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