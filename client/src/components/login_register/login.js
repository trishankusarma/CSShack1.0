import React,{ useState,useContext , useEffect } from 'react';
import { Link } from "react-router-dom";
import AuthContext from '../../context/authContexts/authContext';
import '../../App.css';

const Login=(props)=>{

  const { loginTeacher , userAuth , errors , clearError } = useContext(AuthContext)

  const [ teacherl , setTeacherl ] = useState({
    email:'',password:''
  });

  useEffect(() => {
    if(userAuth){
      props.history.push('/');
    }
  }, [userAuth , props.history])

  const {email,password} = teacherl;

  const handleChangel = (e)=>{
     setTeacherl({
       ...teacherl,
       [e.target.name]:e.target.value
     })
     clearError();
  }
  
  const logSubmit = (e)=>{
    e.preventDefault();
    loginTeacher({email,password});
  }
  return (
    <div>
        <h1 style={{marginLeft:'-400vw'}}>Welcome</h1>
        <div className="login">
          <form className="probinfo" onSubmit={logSubmit}>
            <input className="username" type="email" placeholder="email" name='email'  required autoComplete="off" onChange={handleChangel} value={email}/>
            <input className="username" type="password" placeholder="password" name='password'  required autoComplete="off" onChange={handleChangel} value={password}/>
           
            {errors !== null && <button style={{height:'30px',color:'white',background:'red'}}>
             {errors.msg ? errors.msg : errors.error[0].msg }
             <span style={{position:'relative',left:'40%'}}>X</span>
            </button>} 

            <p className="sign2"><Link to="/register" style={{color:"dodgerblue"}}>New User? Sign Up </Link>.</p>
            <button className="signupbtn" type="submit" id="login_button">Log in</button>
            <p className="sign2"><Link to="/student" style={{color:"dodgerblue"}}>Are you as student ?</Link>.</p>
          </form>
        </div>   
   </div>
  );
}

export default Login;
