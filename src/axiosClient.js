import axios from 'axios'

//const baseURL = 'http://localhost:4040'
const baseURL = 'https://api.valleycuttingsystems.net'

const axiosClient = axios.create({
  baseURL
})

module.exports = { axiosClient, baseURL }
