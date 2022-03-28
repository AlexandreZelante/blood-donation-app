import React from "react";

import "./styles.css";
import logo from "../../images/bloodIcon.png";

import { Link } from "react-router-dom";

export default function Header({ history }) {
    return (
        <div className="headerContainer">
            <img src={logo} alt="" className="logo" />
            <div className="headerListContainer">
                <ul>
                    <li>
                        <Link to="/">Notificações</Link>
                    </li>
                    <li>
                        <Link to="/map">Mapa</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
