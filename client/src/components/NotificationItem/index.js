import React from "react";

import "./styles.css";

export default function NotificationItem({ data }) {
    function tratarDuasCasas(value) {
        if (value.length < 2) {
            return `0${value}`;
        }
        return value;
    }

    function returnTreatedDate(stringDate) {
        const dateObject = new Date(stringDate);

        const dia = tratarDuasCasas(String(dateObject.getDate()));
        const mes = tratarDuasCasas(String(dateObject.getMonth() + 1));
        const hora = tratarDuasCasas(String(dateObject.getHours()));
        const minuto = tratarDuasCasas(String(dateObject.getMinutes()));

        const returnString = `${dia}/${mes}/${dateObject.getFullYear()} as ${hora}:${minuto}h`;
        // console.log(returnString);

        return returnString;
    }

    return (
        <li className="dev-item">
            <header>
                {/* <img src={dev.avatar_url} alt={dev.name} /> */}
                <div className="user-info">
                    <strong>{data.text}</strong>
                    {/* <span className>Tecnologias</span> */}
                </div>
            </header>
            <p>Início: {returnTreatedDate(data.dataInicio)} </p>
            <p>Fim: {returnTreatedDate(data.dataFim)} </p>
            <p>Local: {data.endereco}</p>
        </li>
    );
}
