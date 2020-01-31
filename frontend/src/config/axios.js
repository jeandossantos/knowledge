import axios from 'axios';

const success = resp => resp;

const error = error => {
    if(401 === error.response.status) {
        window.location = '/'
    } else {
        return Promise.reject(error)
    }
}

axios.interceptors.response.use(success, error);