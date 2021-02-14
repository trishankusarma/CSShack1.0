import React,{useState} from 'react'
import {Link} from 'react-router-dom';

import '../../css/student_entry.css';
import axios from 'axios';

const Student_Entry = () => {

    const [student,setStudent] = useState({
        name:'',
        room:'',
        scholarId:0
    })

    const [registered , setRegistered ] = useState(false);

    const [error,setError]=useState(null);

    const [_id , setId ] = useState(null);

    const { name , room , scholarId } = student;

    const handleChange = (e)=>{

        setError(null);

        setStudent({
            ...student,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = async (e)=>{
        e.preventDefault();
        
        const response = await axios.get(`/exam/getExamByRoom/${room}`);

        if(response.data.error!==undefined){
          setError(response.data.error);
          return;
        }
        setId(response.data._id);

        setRegistered(true);
    }

    const container = {
        height:'200px',
        width:'300px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-around',
        allignItems:'center',
        marginLeft:'40vw'
    }

    return (
        <div>
            <h2  className="SEhead">Student registration Portal for Exam</h2>
            <form onSubmit={onSubmit} style={container}>
                 <span className="SEtop">Enter Your Name</span>
                <input type='text' name='name' onChange={handleChange} value={name} placeholder='Enter your name' className="SEinput"/>
                <span className="SEtop">Enter Your Scholar Id</span>
                <input type='Number' name='scholarId' onChange={handleChange} value={scholarId} placeholder='Enter your scholarId' className="SEinput"/>
                <span className="SEtop">Enter Your Room Name</span>
                <input type='text' name='room' onChange={handleChange} value={room} placeholder='Enter your room name' className="SEinput"/>
                <br />
                <button type='submit' className="SEbutton">Check if exam is still going on</button>
            </form>
            
            {error!==null ? <span style={{color:'white'}}>Error: {error}</span> : null}

            { registered===true ? 
                  <Link to={`/exam_hall?name=${name}&room=${room}&scholarId=${scholarId}&_id=${_id}&st=0`}><button className="SEfinal">Click to Enter Classroom</button></Link> 
            : null }

        </div>
    )
}

export default Student_Entry
