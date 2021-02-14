import axios from 'axios';
import { useEffect, useState } from 'react';

import { useParams, Link } from 'react-router-dom';

import { markButton , buttonS , buttonM  , markContainerDesciption , markListStyle , questionAnswer } from './studentCSS';

const StudentAnswerScript=()=>{

  const [ count , setCount ] = useState(0);

  const [ marksList , setMarksList ] = useState(null);

  const [ pdfSrc , setPdfSrc ] = useState(null);

  const [ questionPaper , setQuestionPaper ] = useState(null);

  const [ questionPaperType , setQuestionPaperType ] = useState(null);

  const [ student , setStudent ] = useState(null);

  const [ totalMarks , setTotalMarks ] = useState(0);

  const [ response , setResponse ] = useState(null);

  const { _id } = useParams();

  const arrayBufferToBase64 = (buffer)=>{
     
    var binary = '';
 
    var bytes = [].slice.call(new Uint8Array(buffer));
 
    bytes.forEach((b) => binary += String.fromCharCode(b));
 
    return window.btoa(binary);
  };
  
  useEffect(async ()=>{

   const response = await axios.get(`/student/getStudentDetails/${_id}`);

   await setStudent(response.data);

   console.log(response.data.student.owner);

   const questionPaper = await axios.get(`/exam/getQuestionPaper/${response.data.student.owner}`);

   const base64FlagQ = `data:${questionPaper.data.exam.questionPaperType};base64,`;
           
   const imageStrQ = arrayBufferToBase64(questionPaper.data.exam.questionPaper.data);
   
   setQuestionPaper( base64FlagQ + imageStrQ );

   setQuestionPaperType(questionPaper.data.exam.questionPaperType);

   console.log(questionPaper);

   await setMarksList(response.data.student.marksDistribution);
   
   await setTotalMarks(response.data.student.marks);

   const base64Flag = `data:${response.data.student.answerPaperType};base64,`;
           
   const imageStr = arrayBufferToBase64(response.data.student.answerPaper.data);
   
   setPdfSrc( base64Flag + imageStr );
  },[])

  const handleChange = (e)=>{
    setCount(e.target.value);
  }

  const onSubmit = async (e)=>{
    
    e.preventDefault();
    
    let marks=[];

    for(let i=0;i<count;i++){
      marks.push({ 'index' : i+1 , 'mark' : 0 });
    }

    await setMarksList(marks);

    console.log(marksList);
  }

  const changeMarks = async (e)=>{

     if(parseInt(e.target.value)<0)
       return;

     const list = marksList.map(m => {
      if(parseInt(m.index)===parseInt(e.target.name)){
        
        return{
            index:m.index,
            mark:e.target.value
          }
       }else{
        return{
          index:m.index,
          mark:m.mark
        }       
       }
     })
    await setMarksList(list);

    const total = list.reduce((acc, curr) => (
      acc + parseInt(curr.mark)
   ), 0)
    await setTotalMarks(total);

  }

  const submitMarks = async (e)=>{
      e.preventDefault();
      
      console.log('marksList',marksList);
      
      console.log('total marks',totalMarks);
      
      const config ={
        header:{
          'Content-type':'application/json'
        }
      }

      const stu = {
        marksDistribution : marksList,
        marks : totalMarks,
        status:true
      }

      console.log(stu)

      const res = await axios.patch(`/student/updateStudent/${_id}`,stu,config);

      res.data.error===null?
         setResponse('The answer Script is being checked'):
         setResponse(`An error Occured ${res.data.error}`);
      
  }

  const buttonStyle =  {
    textAlign: 'center',
    padding:'1.5% 1% 1.5% 1%',
    width: '25%',
    backgroundColor: '#252525',
    color:'rgb(255, 255, 255)',
    border:'whitesmoke',
    border:'10px',
    borderRadius:'1vw',
    outline: 'none',
    border: '2px solid #b9babb',
    fontSize: 'large'
}

  return (
    <div className="App">

        { marksList===null || marksList.length===0 ?
              <div>
                   <label style={{color:'white'}} >Enter the number of questions</label>
      
                   <form onSubmit={onSubmit}>
         
                        <input type='number' name='number' value={count} placeholder="Enter the main question Number" onChange={handleChange}/>
         
                        <button type='submit'>Create</button>
                   </form>
              <br />
              </div>
            :
            <div>

                <div style={markContainerDesciption}>

                 <span>Question Numbers</span>
                 
                 <span >Marks Given</span>
                </div> 
                <br />
                <div style={markListStyle}>
                  {marksList.map(c => 
                   
                    <div style={markButton}>
                   
                        <button style={buttonS} key={c.index}>{c.index}</button>
                   
                        <input type='Number' name={`${c.index}`} style={buttonM} key={c.index*100} value={c.mark} onChange={changeMarks} />
                     </div>
                  )}
                </div>
            </div> 
      }
        { marksList!==null ?
              
              <div style={{background:'white' , padding:'5px 5px' , width:'100px' , height:'90px',marginLeft:'45vw',marginTop:'7vh',display:'flex',justifyContent:'spaceAround',flexDirection:'column'}}>
              
                 <span>Total Marks</span><br/>
              
                 <button style={{padding:'5px 5px'}}>{totalMarks}</button>
             
              </div>
          : null}
      
      <div style={questionAnswer}>

       { questionPaper !==null ?
          <embed type={questionPaperType} src={questionPaper} style={{width:'600px' , height:'1000px'}}></embed>
           : <iframe id="tExamqpaper" src="embed.pdf" width="600" height="1000"></iframe>}  

      
       { student !==null ?
         <embed type={student.student.answerPaperType} src={pdfSrc} style={{width:'700px' , height:'1000px'}}></embed> 
       : <iframe id="tExamqpaper" src="embed.pdf" width="700" height="1000"></iframe>} 


      </div>
   
        <form onSubmit={submitMarks} style={{padding:'20px',marginLeft:'-50px'}}>
           
           <button type='submit' style={buttonStyle}>Submit Marks</button>            
        </form>
        
        {response!==null?<button>{response}</button>:null}
    </div>
  );
}

export default StudentAnswerScript;

