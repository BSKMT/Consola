import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.bskmt.com',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})

export default api