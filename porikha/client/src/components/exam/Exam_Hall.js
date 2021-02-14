import React , { useState , useEffect , useContext } from 'react'
import queryString from 'query-string';
import io from 'socket.io-client';

import AppContext from '../../context/examContexts/AppContext';

import axios from 'axios';

import { formContainer } from './examCSS';

import '../../css/porikha.css';
import Timer from '../Timer/Timer';

let socket;

const Exam_Hall = ({location}) => {

    const { exams , storeExamDetails } = useContext(AppContext);

    const [ startDate , setstartDate ] = useState(0);

    const END_POINT = 'localhost:5000';

    const [ name , setName ] = useState('');
    const [ room , setRoom ] = useState('');
    const [ message , setMessage ] = useState('');
    const [ sendMessage , setSendMessage ] = useState('');
    const [ usersInRoom , setusersInRoom ] = useState([]);
    const [ imgSrc , setImgSrc ] = useState('');
    const [ st,setSt ] = useState(-1);
    const [ response , setResponse ] = useState(null);
    const [ fileD , setFileD ] = useState(null); 
    const [ _id , setId ] = useState(''); 
    const [ scholarId, setScholarId ] = useState(0);
    const [ examS , setExamS ] = useState(null);

    const arrayBufferToBase64 = (buffer)=>{
     
        var binary = '';
     
        var bytes = [].slice.call(new Uint8Array(buffer));
     
        bytes.forEach((b) => binary += String.fromCharCode(b));
     
        return window.btoa(binary);
    };
    

    useEffect( async ()=> {

            const { name , room , scholarId , _id , st } = queryString.parse(location.search);

            setSt(st);
            setId(_id);
            setScholarId(scholarId);

            if(examS===null){

               const responseS = await axios.get(`/exam/getQuestionPaper/${_id}`);

               console.log(responseS);

               await setExamS(responseS);

               await storeExamDetails(_id);

               console.log(exams);

            }

            if(examS!==null){

              console.log('Exams',examS.data.exam);

              const base64Flag = `data:${examS.data.exam.questionPaperType};base64,`;
           
              const imageStr = arrayBufferToBase64(examS.data.exam.questionPaper.data);

              setImgSrc( base64Flag + imageStr );

              const x = examS!==null ? ( examS.data.exam.timeLength.split(":")[0]*60*60 + examS.data.exam.timeLength.split(":")[1]*60 )*1000 : 0;

              console.log(examS.data.exam.timeLength.split(":")[0] ," ",examS.data.exam.timeLength.split(":")[1], x);
          
              setstartDate(new Date().getTime() + x);

            }
  
            socket = io();

            console.log(socket);

            socket.emit( 'joinRoom' , { username: name , room } );

            socket.on('message', ({ username , text , time }) =>{
                setMessage(text);
            })

            setName(name);
            setRoom(room);

            socket.on('getUsersToRoom',({room , users})=>{
                setusersInRoom(users);
            }) 
            
            return()=>{
                socket.on('disconnect');

                socket.on('getUsersToRoom',({room , users})=>{
                    setusersInRoom(users);
                }) 
                
                socket.off();
            }

    }, [ END_POINT , examS , location.search ])

    console.log(usersInRoom);

    const onSubmit = (e)=>{
        e.preventDefault();

        socket.emit('sendMessage',sendMessage);

        setSendMessage('');

        socket.on('message', ({ username , text , time }) =>{
            setMessage(text);
        })
    }

    const handleChange = (e)=>{
        setSendMessage(e.target.value);
    }

    const setFile = (e)=>{
        setFileD(e.target.files[0]);
    }

    const onSubmitAnswer = (e)=>{
        e.preventDefault();

        console.log(fileD);

        if(fileD && !(fileD.type==='image/png' || fileD.type==='image/jpg' || fileD.type==='image/jpeg' || fileD.type==='application/pdf')){
            setResponse(`Please Upload a image or pdf less than 1MB `);
            return;
        }

       if(fileD && fileD.size>10000000){
           setResponse(`Please Upload a image or pdf less than 10MB ${fileD.size/1000} MB is not allowed`);
           return;
        }

        const formData = new FormData();

        formData.append('name',name);
        formData.append('upload_answer_script',fileD);
        formData.append('_id',_id);
        formData.append('scholarId',scholarId);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axios.post("/student/uploadAnswerScript",formData,config)
            
        .then((response) => {

                console.log(response);
               
                if(response.data.error!==undefined){
                    
                    setResponse(response.data.error);
                    
                    return;
                }
              
                setResponse("The answer Script is successfully uploaded ");

                socket.emit("submitAnswerScript",{ username:name , room:room });

                socket.on('getUsersToRoom',({room , users})=>{
                    setusersInRoom(users);
                }) 
            
        }).catch((error) => {
                console.log(error);
        });
    }

    return (
      <div className="tExam">
           <table className='tExambg'>
              <tr>
                  <td>
                     <h2 className="tExam">EXAM CODE : {room} </h2>
                     <h5 className="tExam">Note for Students :</h5>
                     <input className="tExamnoticeBoard" type="text" name="" value={message} />

                     { st==1 ? 
            
                       <form id="message" onSubmit={onSubmit}>
           
                       <input type='text' className='message' name='msg' id='msg' placeholder="send message" value = {sendMessage} onChange={handleChange}/>
      
                       <button type='submit' style={{height:'40px'}}>Send</button>
      
                     </form> : null }

                     <h5>Question Paper :</h5>
                 
                    { examS!==null ?
                        <embed type={examS.data.exam.questionPaperType} src={imgSrc} style={{width:'700px' , height:'1000px'}}></embed>
                        : <iframe id="tExamqpaper"src="embed.pdf" width="700" height="1000"></iframe>} 

                  </td>
                  <td style={{paddingLeft:'180px',position:'relative',top:'-40vh',left:'-3vw'}}>

                    <h3 className="tExam" style={{marginLeft:'-100px'}}>Time Remaining : <Timer startDate={startDate}/> </h3>


                       { st==1 ? 
                    
                     <div>
                         <h4 className="tExam " style={{marginLeft:'-100px'}} >Student List</h4>

                         <table className="tExamstudentList">

                       <th style={{paddingRight:'100px'}}>Name</th>
                       <th>Status</th>
           

                          {usersInRoom.map((user)=><tr key={user.id}>
               
                             <td>{user.username}</td>
               
                             <td>{user.status===true?"True":"False"}</td>
           
                         </tr>)} 

                        </table>
                     </div>
                       
                        :
                        <div style={{background:'white',padding:'40px' , marginLeft:'-40px'}}>
                           <form style={formContainer} onSubmit={onSubmitAnswer}>
                          
                          <label>Choose Your Answer Script Here</label>
                          <input type='file'  name="upload_answer_script" onChange={setFile} required/>
                         
                          <button>Submit Answer Script</button>
                          </form>
                           {response!==null ? <span>{response}</span> : null}
                          </div> 
                        }

                  </td>
              </tr>
           </table>
      </div>   
    )
}

export default Exam_Hall;