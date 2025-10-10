export const postuser = async (data, uurl) => {
    const response = await fetch("https://cleancity-carnival.vercel.app/api/auth/" + uurl, { //sending the data on this network

        method: "POST", //using postr method
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data), //convert the js object into json string
        credentials: "include"  // <-- required for sessions
    });
    const result = await response.json()
    if ((await response).ok) {
        alert(result.message); //result.user.name
        // //shows success message!!!////
        return result;
    }
    else {
        alert(result.message);// //something wronge////
        return false;
    }
};

export const postComplaint = async (data, uurl) => {
    try {
        // Check if the data includes a file object 
        const hasFile = data.photo instanceof File; // data.photo will be 'selectedFile' from CitizenDashboard

        // Build the request body based on whether a file is present
        let body;
        let headers = {}; // Initialize headers object

        if (hasFile) {
            // If a file is present, use FormData for multipart/form-data
            const formData = new FormData();
            formData.append('photo', data.photo);

            // Append all other fields
            for (const key in data) {
                // Skip the photo object itself and any null/undefined values
                if (key !== 'photo' && data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            }
            body = formData;
            headers = {};
        } else {
            // If no file, continue sending as JSON 
            body = JSON.stringify(data);
            headers['Content-Type'] = 'application/json';
        }
        const response = await fetch("https://cleancity-carnival.vercel.app/api/auth/" + uurl, { //sending the data on this network
            method: "POST", //using postr method
            // dynamically defined headers and body
            headers: headers,
            body: body,
            credentials: "include"  // <-- required for sessions
        });

        const result = await response.json()
        if (response.ok) {
            alert(result.message || "Complaint submitted successfully!")
            // //shows success message!!!////
            return true;
        }
        else {
            const errorMsg = result.error ?
                `${result.message}\n(Details: ${result.error})` :
                result.message;
            alert(errorMsg || "Failed to submit complaint.");
            console.error('Error details:', result);
            return false;
        }
    } catch (error) { // FAILURE #10 FIX: Catch network errors
        console.error('Network error:', error);
        alert('Network error: Could not connect to server.');
        return false;
    }
};

// NEW FUNCTION to fetch data (GET requests)
export const getComplaints = async (uurl) => {
    const response = await fetch("https://cleancity-carnival.vercel.app/api/auth/" + uurl, {
        method: "GET", // using GET method
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"  // Required for sessions
    });
    const result = await response.json()
    if (response.ok) {
        return result.complaints; // Return the array of complaints
    }
    else {
        alert(result.message || "Failed to fetch complaints.");
        return false;
    }
};

// GET single complaint 
export const getSingleComplaint = async (uurl) => {
    const response = await fetch("https://cleancity-carnival.vercel.app/api/auth/" + uurl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"  // Required for sessions
    });
    const result = await response.json()
    if (response.ok) {
        // return the complaint obeject from the response 
        return result.complaint;
    }
    else {
        alert(result.message || "Failed to fetch complaint detail .");
        return false;
    }
};

// PUT update complaint
export const updateComplaint = async (uurl, data) => {
    const response = await fetch("https://cleancity-carnival.vercel.app/api/auth/" + uurl, {
        method: "PUT", // using PUT method to update 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"  // Required for sessions
    });
    const result = await response.json()
    if (response.ok) {
        alert(result.message);
        return true;
    }
    else {
        alert(result.message || "Failed to update complaints.");
        return false;
    }
};

// NEW FUNCTION : DELETE complaint
export const deleteComplaint = async (uurl) => {
    const response = await fetch("https://cleancity-carnival.vercel.app/api/auth/" + uurl, {
        method: "DELETE", // using DELETE method to update 
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"  // Required for sessions
    });
    const result = await response.json()
    if (response.ok) {
        alert(result.message);
        return true;
    }
    else {
        alert(result.message || "Failed to delete complaints.");
        return false;
    }
};

// Fetch all compaints for Admin portal 
export const getAllComplaints = async (uurl) => {
    const response = await fetch("https://cleancity-carnival.vercel.app/api/auth/" + uurl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"  // Required for sessions
    });
    const result = await response.json()
    if (response.ok) {
        return result.complaints;
    }
    else {
        alert(result.message || "Failed to fetch all complaints.");
        return false;
    }
};

// Fetch complaints for staff (filtered by staff nummber)
// uurl should be "StaffComplaints?staffnumber=STAFFID"
export const getStaffComplaints = async (uurl) => {
    const response = await fetch("https://cleancity-carnival.vercel.app/api/auth/" + uurl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    const result = await response.json()
    if (response.ok) {
        return result.complaints; // return array of assigned complaints
    }
    else {
        alert(result.message || "Failed to fetch assigned complaints.");
        return false;
    }
}

export const getStaffnumber = async(uurl) => {
    const response = await fetch("https://cleancity-carnival.vercel.app/api/auth/"+uurl,{
        method:"GET", 
        headers:{
            "Content-Type": "application/json"
        },
        credentials: "include"  
    });
    const result=await response.json()
     if(response.ok){
        return result.staffnumber; // return array of assigned complaints
        }
    else{
    alert(result.message || "Failed to fetch the number of staff");
    return false;
    }
}

// PUT update assignment
export const assignmentStaff = async(data, uurl) => {
    const response =await fetch("https://cleancity-carnival.vercel.app/api/auth/"+uurl,{
        method:"POST", // using Post method 
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
    alert(result.message || "Failed to Assign complaint!!!");
    return false;
    }
};