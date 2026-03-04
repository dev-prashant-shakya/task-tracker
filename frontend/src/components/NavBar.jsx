import {Link, useNavigate} from "react-router-dom";
import classes from '../CssModules/NavBar.module.css';
import Logo from "../assets/todologo.png";
import { useEffect, useState } from "react";

function NavBar() {
    const [login, setLogin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await fetch('https://todo-back-7ddq.onrender.com/verify-token', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setLogin(data.success);
            } catch (error) {
                console.error('Auth verification failed:', error);
                setLogin(false);
            }
        };

        verifyAuth();

        // Also listen for storage events (for when login/logout happens)
        const handleStorageChange = () => {
            verifyAuth();
        };
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        }
    },[]);

    const handleLogout = async () => {
        try {
            await fetch('https://todo-back-7ddq.onrender.com/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        localStorage.removeItem('userEmail');
        setLogin(false);
        window.dispatchEvent(new Event("storage"));
        navigate('/login');
    };

    return (
        <>  
            <div className={classes.navContainer}>
                <nav className={classes.navbar}>
                    <span className={classes.logo}>
                        <img className={classes.logoImage} src={Logo} alt="Todo App logo"/>
                        <div className={classes.logoTextWrapper}>
                            <span className={classes.logoText}>Todo Keeper</span>
                            <span className={classes.logoSubText}>Your everyday Todo Tracker ...</span>
                        </div>
                    </span>
                    <ul className={classes.navList}>
                        {
                            login ? <>
                                <li><Link to={"/"}>Todo List</Link></li>
                                <li><Link to={"/add-task"}>Add Todo</Link></li>
                                <li><button onClick={handleLogout} className={classes.logoutBtn}>Logout</button></li>
                            </> : null
                        }
                    </ul>
                </nav>
            </div>
        </>
    )
};

export default NavBar;