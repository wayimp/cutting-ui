import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4040'
    //baseURL: 'https://api.valleycuttingsystems.net'
});

export default instance;