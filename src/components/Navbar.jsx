import React from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">Romstud Feedback</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/testimonials">Testimonials</Link>
                </li>
                <li>
                    <Link to="/admin">Admin</Link>
                </li>
                <li>
                    <Link to="/thankyou">Thank You</Link>
                </li>
            </ul>
        </nav>
    );  
};

export default Navbar;