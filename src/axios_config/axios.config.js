import axios from 'axios'
const http = axios.create({
    baseURL: "http://hub-admin-laravel-edition.test:8080",
    headers : {
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    withCredentials : true
});

export default http;
