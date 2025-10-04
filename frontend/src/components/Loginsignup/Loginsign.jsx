import React, { useState } from 'react'
import '../Loginsignup/Loginsign.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
// import CircusTentIcon from './circus-tent.png'; // or .svg, .jpg etc.

export const Loginsign = () => {
  const[Action,setAction]=useState("Sign Up");
  const[Name,setName]=useState('');
  const[Email,setEmail]=useState('');
  const[Password,setPassword]=useState('');
  const[OTP,setOTP]=useState('');
  const [Role,setRole]=useState('citizen');
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
    <option value="citizen">Citizen</option>
    <option value="staff">Staff</option>
    <option value="admin">Admin</option>
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
      {  Action==="Sign Up"?(<div className='input'>
           <img src={password_icon} alt="" />
                {/* onChange helps in updating the live input value to variable of input */}
                <input type="Password" placeholder='OTP' value={OTP} id='OTP' onChange={(curr)=>setOTP(curr.target.value)}/>

        </div>  ):<div className='input'></div>
        }
   
        <div className="Submit_container">
          <div className={Action!=="Sign Up"?'Submit white':'Submit'} onClick={()=>{
            setAction("Sign Up")}
           }>Sign Up</div>
           <div className={Action==="Sign Up"?'Submit white':'Submit'} onClick={()=>{
            setAction("Login")
           }}>Login</div>
          
        </div>


    </div>
    </div>
  )
};
