import axios from "axios";

const api = axios.create({
    baseURL: "http://blooddonationapp-icc.mybluemix.net/"
});

export default api;
