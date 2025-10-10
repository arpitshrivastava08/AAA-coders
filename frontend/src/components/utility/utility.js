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
};

export const postComplaint=async(data,uurl)=>{
    const response =await fetch("http://localhost:3000/api/auth/"+uurl,{ //sending the data on this network
        method:"POST", //using postr method
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(data), //convert the js object into json string
        credentials: "include"  // <-- required for sessions
    });

    const result=await response.json()
    if(response.ok){
        alert(result.message || "Complaint submitted successfully!")
        // //shows success message!!!////
        return true;
        }
    else{
        return false;
    }
};

// NEW FUNCTION to fetch data (GET requests)
export const getComplaints = async(uurl)=>{
   const response =await fetch("http://localhost:3000/api/auth/"+uurl,{
        method:"GET", // using GET method
        headers:{
            "Content-Type": "application/json"
        },
         credentials: "include"  // Required for sessions
    });
    const result=await response.json()
     if(response.ok){
        return result.complaints; // Return the array of complaints
        }
    else{
    alert(result.message || "Failed to fetch complaints.");
    return false;
    }
};

// GET single complaint 
export const getSingleComplaint = async(uurl) => {
    const response =await fetch("http://localhost:3000/api/auth/"+uurl,{
        method:"GET",
        headers:{
            "Content-Type": "application/json"
        },
        credentials: "include"  // Required for sessions
    });
    const result=await response.json()
     if(response.ok){
        // return the complaint obeject from the response 
        return result.complaint; 
        }
    else{
    alert(result.message || "Failed to fetch complaint detail .");
    return false;
    }
};

// PUT update complaint
export const updateComplaint = async(uurl, data) => {
    const response =await fetch("http://localhost:3000/api/auth/"+uurl,{
        method:"PUT", // using PUT method to update 
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(data),
        credentials: "include"  // Required for sessions
    });
    const result=await response.json()
     if(response.ok){
        alert(result.message);
        return true;
        }
    else{
    alert(result.message || "Failed to update complaints.");
    return false;
    }
};

// NEW FUNCTION : DELETE complaint
export const deleteComplaint = async(uurl) => {
    const response = await fetch("http://localhost:3000/api/auth/"+uurl,{
        method:"DELETE", // using DELETE method to update 
        headers:{
            "Content-Type": "application/json"
        },
        credentials: "include"  // Required for sessions
    });
    const result=await response.json()
     if(response.ok){
        alert(result.message);
        return true; 
        }
    else{
    alert(result.message || "Failed to delete complaints.");
    return false;
    }
};

// Fetch all compaints for Admin portal 
export const getAllComplaints = async(uurl) => {
    const response = await fetch("http://localhost:3000/api/auth/"+uurl,{
        method:"GET", 
        headers:{
            "Content-Type": "application/json"
        },
        credentials: "include"  // Required for sessions
    });
    const result=await response.json()
     if(response.ok){
        return result.complaints; 
        }
    else{
    alert(result.message || "Failed to fetch all complaints.");
    return false;
    }
};

// Fetch complaints for staff (filtered by staff nummber)
// uurl should be "StaffComplaints?staffNumber=STAFFID"
export const getStaffComplaints = async(uurl) => {
    const response = await fetch("http://localhost:3000/api/auth/"+uurl,{
        method:"GET", 
        headers:{
            "Content-Type": "application/json"
        },
        credentials: "include"  
    });
    const result=await response.json()
     if(response.ok){
        return result.complaints; // return array of assigned complaints
        }
    else{
    alert(result.message || "Failed to fetch assigned complaints.");
    return false;
    }
}