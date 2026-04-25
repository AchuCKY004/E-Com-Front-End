import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import download from "../../assets/download.png";
import icon from '../../assets/iconn.png';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Api from "../../api/axios";
import { toast } from "react-toastify";


function RegisterPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");

    const onRegister = async (e) => {
        e.preventDefault();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!username || !firstname || !lastname || !email || !address || !password || !confirmpassword) {
            toast.warning("Please fill in all fields.");
            // alert("Please fill in all fields.");
            return;
        }


        if (!emailPattern.test(email)) {
            toast.warning("Please enter a valid email address.");
            // alert("Please enter a valid email address.");
            return;
        }

        // if (!passwordPattern.test(password)) {
        // toast.warning("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");        
        //     alert("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
        //     return;
        // }

        if(password != confirmpassword){
            toast.warning("Password and Confirm Password do not match.");
            // alert("Password and Confirm Password do not match.");
            return;
        }

        try {
            const response = await Api.post("/users/register", {
                username, firstname, lastname, email, address, password, confirmpassword
            });

            const data = response.data;
            toast.success("Registration Successful && OTP sent to your email!");
            // alert("Registration Successful && OTP sent to your email!");
            console.log(data);
            navigate("/otp", { state: { email: email } }); 
        } catch (error) {
            console.error("Error:", error);
            if (error.response) {
                toString.error(error.response.data.message);
                // alert(error.response.data.message);
            } else {
                toString.error("An error occurred. Please try again.");
                // alert("An error occurred. Please try again.");
            }
        }


    };


    return (
        <div className="container d-flex justify-content-center align-items-center py-5" >
            <div className="row  shadow mx-2" style={{

                maxWidth: "900px",
                width: "100%",
                borderRadius: "20px",
            }}>

                {/* //left side form  */}

                <div className=" col-12 col-md-6  d-flex justify-content-center align-items-center" >
                    <div className="card overflow-hidden  border-0" style={{
                        borderRadius: "20px",
                        height: "90%",
                        width: "100%",
                        background: "linear-gradient(to top, #ff9800, #ff5722)",
                    }} >
                        <div style={{ height: "60%" }}>
                            <img
                                src={download}
                                className="img-fluid"
                                alt="Club House"
                                style={{ objectFit: "cover", height: "100%", width: "100%" }}
                            />
                        </div >
                        <div className="card-body d-flex flex-column justify-content-center align-items-center" style={{ height: "40%" }}>
                            <h2 className="card-title text-center ">Welcome to Clubhouse</h2>
                            <p className="text-center">Already have an account? <a href="/login">Login here</a></p>
                            <p className="text-center">Join the conversation and connect with friends on Clubhouse!</p>
                        </div>
                    </div>
                </div>
                {/* //right side form  */}
                <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <div className="card p-4 border-0" style={{
                        borderRadius: "20px",
                        height: "90%",
                        width: "100%",
                        maxWidth: "500px",
                    }} >

                        <div className="d-flex  justify-content-center align-item-center  " style={{ marginTop: "-20px" }}>
                            <img
                                src={icon}
                                alt="logo"
                                style={{ width: "40px", height: "40px", marginRight: "2px", outline: "linear-gradient(to top, #ff9800, #ff5722)" }}

                            />
                            <span className="fw-bold fs-5">CYB ECom</span>
                        </div>
                        <h3 className="card-title text-center mt-3" >Register To ClubHouse </h3>
                        <form onSubmit={onRegister}>
                            <div className=" mb-3 mt-3" >
                                {/* <label className="form-label">Username</label> */}
                                <input type="text" placeholder="Username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} style={{ backgroundColor: "#edf2f6" }} />
                            </div>
                            <div className="row ">
                                <div className="col-md-6 mb-3  ">
                                    {/* <label className="form-label">First Name</label> */}
                                    <input type="text" placeholder="First Name" className="form-control" value={firstname} onChange={(e) => setFirstname(e.target.value)} style={{ backgroundColor: "#edf2f6" }} />
                                </div>
                                <div className="col-md-6 mb-3  ">
                                    {/* <label className="form-label">Last Name</label> */}
                                    <input type="text" placeholder="Last Name" className="form-control" value={lastname} onChange={(e) => setLastname(e.target.value)} style={{ backgroundColor: "#edf2f6" }} />
                                </div>
                            </div>
                            <div className="mb-3  ">
                                {/* <label className="form-label">Email</label> */}
                                <input type="email" placeholder="Email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} style={{ backgroundColor: "#edf2f6" }} />

                            </div>
                            <div className="mb-3   ">
                                {/* <label className="form-label">Address</label> */}
                                <input type="address" placeholder="Address" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} style={{ backgroundColor: "#edf2f6" }} />
                            </div>
                            <div className="mb-3  ">
                                {/* <label className="form-label">Password</label> */}
                                <input type="password" placeholder="Password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} style={{ backgroundColor: "#edf2f6" }} />
                            </div>
                            <div className="mb-3  ">
                                {/* <label className="form-label">Confirm Password</label> */}
                                <input type="password" placeholder="Confirm Password" className="form-control" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ backgroundColor: "#edf2f6" }} />
                            </div>


                            <button className="btn btn-primary w-100 " style={{ borderRadius: "20px" }} type="submit">Register</button>

                            <div className="mb-3">
                                <p className="text-center mt-3">Already have an account? <Link to="/login">Login here</Link></p>
                            </div>




                            {/* <div className="d-flex align-items-center my-2">
                                <hr className="flex-grow-1" />
                                <span className="mx-2 text-muted fs-8">Or Login With</span>
                                <hr className="flex-grow-1" />
                            </div> */}

                            {/* <div className="row g-2">
                                <div className="col-md-6">
                                    <button className="btn btn-outline-secondary w-100 mb-2 fw-bold text-black ">Google</button>
                                </div>

                                <div className="col-md-6"> 
                                    <button className="btn btn-outline-secondary w-100 mb-2 fw-bold text-black" >Facebook</button>
                                </div>

                            </div> */}


                        </form>
                    </div>
                </div>
            </div>
        </div>

    )



}

export default RegisterPage;