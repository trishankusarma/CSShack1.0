import React,{useState,useEffect,useContext} from "react";
import "../../css/Page1.css";
import { Link , useParams } from "react-router-dom";
import Navbar from '../navbar/Navbar';
import SearchExam from './searchExams';

import AppContext from '../../context/examContexts/AppContext';
import Noresults from './Noresults';

const Exam=()=>{

    const { _id } = useParams();

    const [ exams , setExams ] = useState(null);

    const { getCorrespondingExams , search , correspondingExams } = useContext( AppContext );
    
    useEffect(async () => {

           await getCorrespondingExams(_id);

           await setExams(correspondingExams);

           console.log(correspondingExams);

    }, [correspondingExams])

    return (
        <>
            <Navbar />
            <div className="Page1">
                    <div className="lev1">
                        <SearchExam className="box1"></SearchExam>
                        <div className="box2">
                            <h2><Link to = {`/exam/create/${_id}`} style={{textDecoration:'none',color:'white'}}>Create Exam</Link></h2>
                        </div>
                    </div>
                    <div className="history" >
                        <h4>HISTORY</h4>
                    </div>
                    <div className="table">
                    <table>
                            <tr>
                                <th>Exam ID</th>
                                <th>EXAM DATE</th>
                                <th>NAME</th>
                            </tr>

                            { search!==null ? 
                               
                                search.length===0 ? 
                                
                                <Noresults /> : 
                                 search.map(exam =>(
                                    <tr>
                                       <Link to ={`/exam/details/${exam._id}`} style={{textDecoration:'none',color:'white'}}>{exam._id}</Link>
                                       <td>{exam.date.split("T")[0]}</td>
                                       <td>{exam.name}</td>
                                    </tr>
                                )) : 
                                 exams===null || exams.length===0 ? <Noresults /> :
                                 exams.map(exam =>(
                                    <tr>
                                       <Link to ={`/exam/details/${exam._id}`} style={{textDecoration:'none',color:'white'}}>{exam._id}</Link>
                                       <td>{exam.date.split("T")[0]}</td>
                                       <td>{exam.name}</td>
                                    </tr>
                                )) 
                            }
                           
                        </table>
                    </div>
                    
               </div>
        </>)
}

export default Exam;