import { useEffect, useState } from "react";
import classes from "../CssModules/Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import BackgroundVideo from "../assets/add-todo.mp4";

function SignupPage() {
    const [userData, setUserData] = useState({name: '', email: '', password: ''});
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('userEmail')) {
            navigate('/');
        }
    }, [navigate]);

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(userData);
        let response = await fetch('https://todo-back-7ddq.onrender.com/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: 'include',
        });

        response = await response.json();
        if(response.success) {
            localStorage.setItem('userEmail', userData.email);
            window.dispatchEvent(new Event("storage"));
            navigate('/');
        }else {
            alert("Signup failed. Please try again.");
        }
    };

    return (
        <div className={classes["signup-container"]}>
            <video 
                className={classes["background-video"]}
                src={BackgroundVideo} 
                autoPlay 
                muted 
                loop 
                playsInline
                preload="metadata"
            />
            <div className={classes["overlay"]}></div>
            <div className={classes["signup-wrapper"]}>
                <h1>Create your account</h1>

                <div className={classes["form-wrapper"]}>
                    <div className={classes["form-labels"]}>
                        <label htmlFor="name">Your name <sup>*</sup></label>
                        <input onChange={(event) => setUserData({...userData, name: event.target.value})} type="text" id="name" name="name" placeholder="Enter your name" />
                    </div>
                    <div className={classes["form-labels"]}>
                        <label htmlFor="email">Email <sup>*</sup></label>
                        <input onChange={(event) => setUserData({...userData, email: event.target.value})} type="email" id="email" name="email" placeholder="Enter your email" />
                    </div>
                    <div className={classes["form-labels"]}>
                        <label htmlFor="password">Password <sup>*</sup></label>  
                        <input onChange={(event) => setUserData({...userData, password: event.target.value})} type="password" id="password" name="password" placeholder="Enter your password" />
                    </div>
                    <div className={classes["button-wrapper"]}>
                        <button onClick={signupHandler} className={classes["signup-btn"]} type="button">Sign Up</button>
                    </div>
                    <Link to="/login" className={classes["login-link"]}>Already have an account? Login here</Link>
                </div>
            </div>
        </div>
    )
}

export default SignupPage;