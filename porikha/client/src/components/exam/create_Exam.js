import React,{ useState , useContext , useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import '../../css/create_exam.css';
import AppContext from '../../context/examContexts/AppContext';
import { useParams } from 'react-router-dom';
import authContext from '../../context/authContexts/authContext';


const Create_Exam = ()=> {

    const { _id } = useParams();

    const { storeExamDetails } = useContext(AppContext);

    const [ response , setResponse ] = useState(''); 

    const [ examCreated , setExamCreated ] = useState(false);

    const [ examRequested , setExamRequested ] = useState(false);

    const [ examId , setExamId ] = useState('');

    const [ exam , setExam ] = useState({
        name:'',hour:'0',minute:'0'
    })

    const [ fileD , setFileD ] = useState(null); 

    const { name , hour , minute } = exam;

    const { teacher , getTeacher } = useContext(authContext);

    const [ teacherState , setTeacherState ] = useState(null);

    useEffect(async ()=>{
        if(teacherState===null){
          await getTeacher();
          await setTeacherState(teacher);
        }
    },[teacher]);

    const handleChange = (e)=>{
        setExam({
            ...exam,
            [e.target.name]:[e.target.value]
        })
    }

    const setFile = (e)=>{
        setFileD(e.target.files[0]);
    }

    const onSubmit = async (e)=>{

        e.preventDefault();

        setExamRequested(true);

        console.log(exam,fileD);

        if(fileD && !(fileD.type==='image/png' || fileD.type==='image/jpg' || fileD.type==='image/jpeg' || fileD.type==='application/pdf')){
            setResponse(`Please Upload a image or pdf less than 1MB `);
            setExamRequested(false);
            return;
        }

       if(fileD && fileD.size>1000000){
           setResponse(`Please Upload a image or pdf less than 1MB ${fileD.size} kb is not allowed`);
           setExamRequested(false);
           return;
        }

        const formData = new FormData();

        formData.append('name',name);
        formData.append('hour',hour);
        formData.append('minute',minute);
        formData.append('upload_question_paper',fileD);
        formData.append('_id',_id);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axios.post(`/exam/uploadQuestionPaper`,formData,config)
            
        .then((response) => {

                console.log(response.data);
               
                if(response.data.error!==undefined){
                    
                    setResponse(response.data.error);
                    
                    return;
                }
              
                setResponse("The question paper is successfully uploaded and the exam room has been created");

                setExamCreated(true);

                setExamId(response.data.exam._id);

                storeExamDetails(response.data.exam._id);
            
        }).catch((error) => {
                setExamRequested(false);
                console.log(error);
        });
    }

    const disableButton = {  disabled: 'disabled' }

    const heading={
        marginLeft:'-400vw'
    }

    return(
        <>   
     <>   
              <h1 id="createheading">NEW EXAM</h1>

              <form onSubmit={onSubmit} id="hello">
              
                <input type="text"  className="newexambutton_top"  placeholder='Enter Examination Name' name='name' onChange={handleChange} value={name} required/><br />
              
                <h1 className="settime" style={{color:'white'}}>Set Time( hh : mm )</h1>
                
                <input type="Number"  className="newexambutton_time" placeholder='hr' name='hour' onChange={handleChange} value={hour} required/>
        
                <input type="Number"  className="newexambutton_time" placeholder='min' name='minute' onChange={handleChange} value={minute} required/><br />
                
                <h1 className="upload_newexam" style={{color:'white'}}>Upload Question Paper</h1>  

                <input type='file'  className="newexambutton"  name="upload_question_paper" onChange={setFile} required/><br />
              
                <button type='submit' className="newexamsubmit" style={disableButton}>Create Exam</button>
              
              </form>

              <div style={{color:'white'}} className="personal_msg">

                 { response!==''? response : '' }

              </div>
              { examCreated===true && teacherState!==null ? 
                  <Link to={`/exam_hall?name=${teacherState.name}&room=${name}&_id=${examId}&st=1`}><button>Click to Enter Classroom</button></Link> 
              : null }
             
         </>
      
   </>
    )
}

export default Create_Exam;