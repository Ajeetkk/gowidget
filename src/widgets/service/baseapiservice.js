import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
    baseURL: ''
});

axiosInstance.interceptors.request.use(request => {
    request.headers.Authorization = localStorage.getItem('token');
    const spinner = document.getElementById('spinner');
    spinner.classList.remove("hide");
    spinner.classList.add("show");
    return request;
}, error => {
    toast.error(error.toString(), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
    const spinner = document.getElementById('spinner');
    spinner.classList.remove("show");
    spinner.classList.add("hide");
    return Promise.reject({ ...error });
});

axiosInstance.interceptors.response.use(response => {
    const spinner = document.getElementById('spinner');
    spinner.classList.remove("show");
    spinner.classList.add("hide");
    return response;
}, error => {
    toast.error(error.toString(), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
    const spinner = document.getElementById('spinner');
    spinner.classList.remove("show");
    spinner.classList.add("hide");
    return Promise.reject({ ...error });
});

class BaseApiService {
    async get(url, params, isLoader) {
        return await axiosInstance.get(url).then(resp => resp.data);
    }

    async post(url, reqObject, isLoader) {
        return await axiosInstance.post(url, reqObject);
    }

    async put(url, reqObject, isLoader) {
        return await axiosInstance.put(url, reqObject);
    }

    async delete(url, params, isLoader) {
        return await axiosInstance.delete(url, params);
    }

    async patch(url, params, isLoader) {
        return await axiosInstance.patch(url, params);
    }

    success(message) {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }

    error(message) {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
}

export default BaseApiService;
