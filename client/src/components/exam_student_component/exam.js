import React,{useState,useEffect} from "react";
import "../../css/Page1.css";
import { Link , useParams } from "react-router-dom";
import Navbar from '../navbar/Navbar';

import axios from 'axios';

const Exam=()=>{

    const { _id } = useParams();

    const [ exams , setExams ] = useState(null);

    console.log(_id);
    
    useEffect(async () => {

        const res = await axios.get(`/classroom/${_id}`); 
       
        setExams(res.data);

    }, [])

    return (
        <>
            <Navbar />
            <div className="Page1">
                    <div className="lev1">
                        <div className="box1">
                        </div>
                        <div className="box2">
                            <h2><Link to = {`/exam/create/${_id}`} style={{textDecoration:'none',color:'white'}}>Create Exam</Link></h2>
                        </div>
                    </div>
                    <div className="history">
                        <h4>HISTORY</h4>
                    </div>
                    <div className="table">
                    <table>
                            <tr>
                                <th>Exam ID</th>
                                <th>EXAM DATE</th>
                                <th>NAME</th>
                                <th>STATUS</th>
                                <th>CHECKBOX</th>
                            </tr>
                        {exams!==null ? 
                            exams.map(exam =>(
                                <tr>
                                   <Link to ={`/exam/details/${exam._id}`} style={{textDecoration:'none',color:'white'}}>{exam._id}</Link>
                                   <td>{exam.date.split("T")[0]}</td>
                                   <td>{exam.name}</td>
                                   <td>190</td>
                                   <td><input type="checkbox"></input></td>
                                </tr>
                            )) : <tr>
                            <td>NA</td>
                            <td>NA</td>
                            <td>0</td>
                            <td>?</td>
                         </tr> }
                           
                        </table>
                    </div>
                    
                    </div>

        </>)
}

export default Exam;