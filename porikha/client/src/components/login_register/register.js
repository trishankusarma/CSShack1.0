import React,{ useState , useContext , useEffect } from 'react';
import { Link } from "react-router-dom";
import AuthContext from '../../context/authContexts/authContext';
import '../../App.css';

const Register=(props)=>{
 
  const { registerTeacher , userAuth , errors ,setError , clearError } = useContext(AuthContext)
  const [hide , setHide] = useState(true);

  useEffect(() => {
    if(userAuth){
      props.history.push('/');
    }
  }, [userAuth , props.history])

  const [ teacher , setTeacher ] = useState({
    name:'',email:'',password:'',password_repeat:'',phoneNumber:'',institute:''
  });

  const {name,email,password,password_repeat,phoneNumber,institute} = teacher;

  const handleChange = (e)=>{
     setTeacher({
       ...teacher,
       [e.target.name]:e.target.value
     })
     clearError();
  }
  
  const submit = async (e)=>{
    e.preventDefault();
    if(password !== password_repeat){
      await setError("Password don't match");
      setHide(false);
    }else{
      await registerTeacher({name,email,password,phoneNumber,institute});
      setHide(false);
    }
  }

  const hideDisplay = e=>{
    setHide(true);
  }

  return (
    <div className="register">
    <form className="probinfo" onSubmit={submit}>
        <h1 className="sign">Sign Up</h1>
        <p className="sign2">Please fill in this form to create an account.</p>
        <input className="username" type="text" placeholder="Enter name" name="name" required autoComplete="off" onChange={handleChange} value={name}/>
        <input className="username" type="email" placeholder="Enter Email" name="email" required autoComplete="off" onChange={handleChange} value={email}/>
        <input className="username" type="number" placeholder="Enter Mobile Number" name="phoneNumber" required autoComplete="off" onChange={handleChange} value={phoneNumber}/>
        <input className="username" type="password" placeholder="Enter Password" name="password" required onChange={handleChange} value={password}/>
        <input className="username" type="password" placeholder="Repeat Password" name="password_repeat" required onChange={handleChange} value={password_repeat}/>
        <input className="username" type="text" placeholder="Currently Working institution" name="institute" required autoComplete="off" onChange={handleChange} value={institute}/>
   
        { hide===false && errors !== null && <button style={{height:'40px',color:'white',background:'red'}}>
         {errors.msg ? errors.msg : errors.error[0].msg }
         <button style={{marginLeft:'50%'}} onClick={hideDisplay}>X</button>
       </button>} 

       <p className="sign2">Do have an account ? <Link to="/login" style={{color:"dodgerblue"}}>Login Here</Link>.</p>
       <button type="submit" className="signupbtn">Sign up</button>
  
     </form>  
   </div>
  );
}

export default Register;
