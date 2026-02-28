import { useEffect, useState } from "react";
import classes from "../CssModules/Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import BackgroundVideo from "../assets/add-todo.mp4";

function LoginPage() {
    const [userData, setUserData] = useState({email: '', password: ''});
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('userEmail')) {
            navigate('/');
        }
    }, [navigate]);

    const loginHandler = async (e) => {
        e.preventDefault();
        console.log(userData);

        let response = await fetch('http://localhost:3200/login', {
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
            alert("Invalid email or password");
        }
    }

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
                <h1>Login to your account</h1>

                <div className={classes["form-wrapper"]}>
                    <div className={classes["form-labels"]}>
                        <label htmlFor="email">Email <sup>*</sup></label>
                        <input onChange={(event) => setUserData({...userData, email: event.target.value})} type="email" id="email" name="email" placeholder="Enter your email" />
                    </div>
                    <div className={classes["form-labels"]}>
                        <label htmlFor="password">Password <sup>*</sup></label>  
                        <input onChange={(event) => setUserData({...userData, password: event.target.value})} type="password" id="password" name="password" placeholder="Enter your password" />
                    </div>
                    <div className={classes["button-wrapper"]}>
                        <button onClick={loginHandler} className={classes["signup-btn"]} type="button">Login    </button>
                    </div>
                    <Link to="/signup" className={classes["login-link"]}>Don't have an account? Sign up here</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;