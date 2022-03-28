import React, { useEffect, useState } from "react";
import api from "../../services/api";

import "./styles.css";
import "./App.css";
import "./Sidebar.css";
import "./Main.css";
import "../../global.css";

import NotificationItem from "../../components/NotificationItem";
import NotificationForm from "../../components/NotificationForm";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        async function loadNotifications() {
            const response = await api.get("/getNotifications");

            setNotifications(response.data);
        }

        loadNotifications();
    }, []);

    async function handleAddNotification(data) {
        console.log("Chegou aqui também", data);
        const response = await api.post("/addNotification", data);

        setNotifications([response.data[0], ...notifications]);
    }

    return (
        <div className="app">
            <aside>
                <strong className="titleForm">Adicionar Notificação</strong>
                <NotificationForm onSubmit={handleAddNotification} />
            </aside>

            <main>
                <ul>
                    {notifications.map((notification, index) => (
                        <NotificationItem key={index} data={notification} />
                    ))}
                </ul>
            </main>
        </div>
    );
}
