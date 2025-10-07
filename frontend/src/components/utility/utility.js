export const postuser=async(data,uurl)=>{
   const response =await fetch("http://localhost:3000/api/auth/"+uurl,{ //sending the data on this network
    
        method:"POST", //using postr method
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(data), //convert the js object into json string
         credentials: "include"  // <-- required for sessions
    });
    const result=await response.json()
     if((await response).ok){
        alert(result.message); //result.user.name
        // //shows success message!!!////
        return result;
        }
    else{
    alert(result.message);// //something wronge////
    return false;
    }
}