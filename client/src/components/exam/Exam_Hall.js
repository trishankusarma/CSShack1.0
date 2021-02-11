import React , { useState , useEffect , useContext } from 'react'
import queryString from 'query-string';
import io from 'socket.io-client';

import AppContext from '../../context/examContexts/AppContext';

import axios from 'axios';

let socket;

const Exam_Hall = ({location}) => {

    const { exams , storeExamDetails } = useContext(AppContext);

    const END_POINT = 'localhost:8080';

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

            if(exams===null){

               await storeExamDetails(_id);

            }

            if(exams!==null){

              console.log('Exams',exams.data.exam);

              const base64Flag = `data:${exams.data.exam.questionPaperType};base64,`;
           
              const imageStr = arrayBufferToBase64(exams.data.exam.questionPaper.data);

              setImgSrc( base64Flag + imageStr );

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

    }, [ END_POINT , exams , location.search ])

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
            
        }).catch((error) => {
                console.log(error);
        });
    }

    const formContainer = {
        height:'120px',
        width:'250px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-around',
        allignItems:'center'
    }

    return (
        <div style={{color:'white'}}>
           
            <h2>Exam Hall</h2>
           
            <button id="bestL">{message}</button>

            { st==1 ? 
            
            <form id="message" onSubmit={onSubmit}>
           
              <input type='text' name='msg' id='msg' placeholder="send message" value = {sendMessage} onChange={handleChange}/>
      
              <button type='submit'>Send</button>
      
           </form> : null }
        
           <label id='room'>
               <span>Room Name : </span>
               <span>{room}</span>
           </label>
            { st==1 ?  
              
               <ul id='users' style={{color:'whitesmoke'}}>
            
                  {usersInRoom.map((user)=><li key={user.id}>{user.username}</li>)}
       
               </ul> : 
              <div>
                 <form style={formContainer} onSubmit={onSubmitAnswer}>
                   
                   <label>Choose Your Answer Script Here</label>
                   <input type='file'  name="upload_answer_script" onChange={setFile} required/>
                  
                   <button>Submit Answer Script</button>
                 </form>
                 {response!==null ? <span>{response}</span> : null}
               </div>
            }

           { exams!==null ? <embed type={exams.data.exam.questionPaperType} src={imgSrc} style={{width:'600px' , height:'900px'}}></embed> : null} 

        </div>
    )
}

export default Exam_Hall
