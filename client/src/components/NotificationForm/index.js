import React, { useState, useEffect } from "react";

import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./styles.css";

import pt from "date-fns/locale/pt";
registerLocale("pt", pt);

export default function NotificationForm({ onSubmit }) {
    const [text, setText] = useState("");
    const [endereco, setEndereco] = useState("");
    const [distancia, setDistancia] = useState(10000);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [finalDate, setFinalDate] = useState(null);

    let handleColor = time => {
        return time.getHours() > 12 ? "text-success" : "text-error";
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;

                setLatitude(latitude);
                setLongitude(longitude);
            },
            err => {
                console.log(err);
            },
            {
                timeout: 30000
            }
        );
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        console.log("Chegou");

        await onSubmit({
            texto: text,
            currentRegion: { latitude, longitude },
            distancia,
            dataInicio: startDate,
            dataFim: finalDate,
            endereco
        });

        setText("");
        setStartDate(null);
        setFinalDate(null);
        setEndereco("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-block">
                <label htmlFor="github_username">MENSAGEM</label>
                <input
                    name="github_username"
                    id="github_username"
                    value={text}
                    onChange={e => setText(e.target.value)}
                ></input>
            </div>

            <div className="input-block">
                <label htmlFor="techs">DATA INÍCIO</label>
                <DatePicker
                    showTimeSelect
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    timeClassName={handleColor}
                    locale="pt"
                    dateFormat="dd/MM/yyyy, hh:mm a"
                />
            </div>

            <div className="input-block">
                <label htmlFor="techs">DATA FIM</label>
                <DatePicker
                    showTimeSelect
                    selected={finalDate}
                    onChange={date => setFinalDate(date)}
                    timeClassName={handleColor}
                    locale="pt"
                    dateFormat="dd/MM/yyyy, hh:mm a"
                />
            </div>

            <div className="input-block">
                <label htmlFor="techs">ENDEREÇO</label>
                <input
                    name="techs"
                    id="techs"
                    value={endereco}
                    onChange={e => setEndereco(e.target.value)}
                ></input>
            </div>

            <div className="input-group" style={{ marginBottom: 20 }}>
                <div className="input-block">
                    <label htmlFor="latitude">LATITUDE</label>
                    <input
                        type="number"
                        name="latitude"
                        id="latitude"
                        value={latitude}
                        onChange={e => setLatitude(e.target.value)}
                    ></input>
                </div>

                <div className="input-block">
                    <label htmlFor="longitude">LONGITUDE</label>
                    <input
                        type="number"
                        name="longitude"
                        id="longitude"
                        value={longitude}
                        onChange={e => setLongitude(e.target.value)}
                    ></input>
                </div>
            </div>

            <div className="input-block">
                <label htmlFor="techs">DISTÂNCIA DO ALERTA</label>
                <input
                    type="number"
                    name="techs"
                    id="techs"
                    value={distancia}
                    onChange={e => setDistancia(e.target.value)}
                ></input>
            </div>

            <button type="submit">Salvar</button>
        </form>
    );
}
