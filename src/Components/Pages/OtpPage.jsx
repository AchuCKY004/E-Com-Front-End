import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from "react-router-dom";
import Api from '../../api/axios';
import { toast } from "react-toastify";

function OtpPage() {

    const navigate = useNavigate();
    const Location = useLocation();
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const email = Location.state?.email;
    const [otp, setOtp] = useState("");

    useEffect(() => {

        let interval;

        if (timer > 0) {

            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

        } else {

            setCanResend(true);

        }

        return () => clearInterval(interval);

    }, [timer]);


    // const resendOtp = async () => {

    //     try {

    //         const response = await Api.post(
    //             "/users/resend-otp",
    //             { email }
    //         );

    //         alert("New OTP Sent");

    //         setTimer(30);
    //         setCanResend(false);

    //     } catch (error) {

    //         console.log("Resend Error:", error.response?.data);

    //     }

    // };


    // const handleOtp = async (e) => {
    //     e.preventDefault();

    //     console.log("Sending OTP Data:", email, otp);



    //     try {

    //         const response = await Api.post(
    //             "/users/verify-otp",
    //             {
    //                 email: email,
    //                 otp: Number(otp)
    //             }
    //         );




    //         alert("Otp Verified! Welcome to Clubhouse!");

    //         navigate("/login"); // go to dashboard

    //     } catch (error) {

    //         console.error("Error:", error);
    //         console.log("Server Error:", error.response.data);

    //         if (error.response) {
    //             alert(error.response.data.message);
    //         } else {
    //             alert("An error occurred. Please try again.");
    //         }

    //     }
    // };
    const resendOtp = async () => {
        try {
            await Api.post("/users/resend-otp", { email });
            toast.info("New OTP Sent");
            // alert("New OTP Sent");
            setTimer(30);
            setCanResend(false);

        } catch (error) {
            console.log("Resend Error:", error.response?.data);
        }
    };

    const handleOtp = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email missing");
            // alert("Email missing");
            return;
        }

        if (!otp) {
            toast.error("Email OTP");
            // alert("Enter OTP");
            return;
        }

        try {
            await Api.post("/users/verify-otp", {
                email,
                otp: Number(otp)
            });
            toast.success("Email OTPOtp Verified!");
            // alert("Otp Verified!");
            navigate("/login");

        } catch (error) {
            console.log("Server Error:", error.response?.data);

            if (error.response) {
                toast.error(error.response.data.message);
                // alert(error.response.data.message);
            } else {
                toast.error("An error occurred.");
                // alert("An error occurred.");
            }
        }
    };
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: '350px' }}>
                <h2 className="text-center mb-4">Clubhouse OTP</h2>

                <form onSubmit={handleOtp}>
                    {/* The OTP Box */}
                    <div className="mb-3">
                        <label className="form-label">Enter OTP </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>



                    <button type="submit" className="btn btn-primary w-100">
                        Open the Gate!
                    </button>
                    {canResend ? (

                        <button
                            type="button"
                            onClick={resendOtp}
                            style={{ marginTop: "10px" }}
                        >
                            Resend OTP
                        </button>

                    ) : (

                        <p style={{ marginTop: "10px" }}>
                            Resend OTP in {timer}s
                        </p>

                    )}
                </form>
            </div>
        </div>
    );
}

export default OtpPage;