import React, { useState } from 'react'
import '../Loginsignup/Loginsign.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import { postuser } from '../utility/utility'
import { useNavigate } from 'react-router-dom';


export const Loginsign = () => {
  const[Action,setAction]=useState("Sign Up");
  const[Name,setName]=useState('');
  const[Email,setEmail]=useState('');
  const[Password,setPassword]=useState('');
  const[OTP,setOTP]=useState('');
  const[Displayotp,setDisplayotp]=useState(false);
  const [Role,setRole]=useState('citizen');
  


const Emailvalidation=(Email)=>{
         const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|mail\.com)$/;
         return regex.test(Email.toLowerCase()); //test the email formation
     };
     const Passwordvalidation=(Password)=>{ //test the password
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
        return regex.test(Password);
     };
     const sendotp=async ()=>{
     if(await postuser({name:Name,email:Email,password:Password,role:Role},"register")){
      setDisplayotp(true);
     }
      return false;
  };
  const verify=async()=>{
     if( await postuser({email:Email,otp:OTP},"verifyotp")){
      setDisplayotp(false);
      setAction('Login');
    }
  };
   const navigate=useNavigate();
  const loginn=async()=>{
    let result=await postuser({email:Email,password:Password,role:Role},"login");
     if(result){
if (result.role === "citizen") navigate("/citizen");
else if (result.role === "admin") navigate("/admin");
else if (result.role === "staff") navigate("/staff");
//dashboard should be displayed!!!
     }

  };


  return (



    <div>
       <div className="hello">
       <div className='circus'>🎪</div>
       <h1 className="caravan-title">CleanCity Connect</h1>
       <p className="circus-subtitle">Welcome to our city complaint system</p>
     </div>
    
    <div className='container'>
      <div className="header">
          <div className='text'>{Action}</div>
            <div className='underline'></div>
      </div>


      <div className='inputs'>
            {(Action==="Sign Up")?<div className='input'>
                <img src={user_icon} alt="" />
                <input type="text" placeholder='Name' value={Name} onChange={(curr)=>setName(curr.target.value)} />
            </div>:<div className='input'></div>}
            </div>
             {/* adding A empth div because in email and password we are giving a div 
            which takes space so it disturbs the look so we are making it equal */}
            <div></div>
   <div className="input selectt">
  <img src={user_icon} alt="" />
  <select value={Role} onChange={(e) => setRole(e.target.value)}>
    <option value="citizen">citizen</option>
    <option value="staff">staff</option>
    <option value="admin">admin</option>
  </select>
</div>  
       <div className='input'>
                <img src={email_icon} alt="" />
                {/* onChange helps in updating the live input value to variable of input */}
                <input type="email" placeholder='Email' value={Email} id='Email' onChange={(curr)=>setEmail(curr.target.value)}/>

        </div>  
        
       <div className='input'>
                <img src={password_icon} alt="" />
                {/* onChange helps in updating the live input value to variable of input */}
                <input type="Password" placeholder='Password' value={Password} id='Password' onChange={(curr)=>setPassword(curr.target.value)}/>

        </div>  
      {  (Action===("Sign Up") && Displayotp)?(<div className='input'>
           <img src={password_icon} alt="" />
                {/* onChange helps in updating the live input value to variable of input */}
                <input type="Password" placeholder='OTP' value={OTP} id='OTP' onChange={(curr)=>setOTP(curr.target.value)}/>

        </div>  ):<div className='input'></div>
        }
   
        <div className="Submit_container">
          <div className={(Action!=="Sign Up"  )?'Submit white':'Submit'} onClick={async()=>{
            if(Displayotp){
              await verify();
            }
            else{
            if(Action==='Sign Up'){ 
        if( Emailvalidation(Email) && Passwordvalidation(Password) && Name){
            await sendotp();
          }else alert("Please enter Email correctly Or Set a strong Password!! Or enter name")
            }
            else{
      setAction("Sign Up");
      setDisplayotp(false);
            setEmail('');
            setName('');
            setOTP("");
            setPassword('');
            }
          }
    }
           }>Sign Up</div>
           <div className={Action==="Sign Up"?'Submit white':'Submit'} onClick={async()=>{
            if(Action==='Login'){ 
              if( Emailvalidation(Email) && Passwordvalidation(Password)){ 
                 loginn();
              }
        else
        alert("Please enter Email correctly Or Set a strong Password!!")
            }else{

            setAction("Login");
            setDisplayotp(false);
            setEmail('');
            setName('');
            setOTP("");
            setPassword('');
            }
           }}>Login</div>
          
        </div>


    </div>
    </div>
  )
};