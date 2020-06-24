import axios from 'axios'

import { backendUrl } from '../configs'

import authHeader from './auth-header'

class AuthService {
    login = (values) => {
        const { email, password, remember } = values
        return axios
            .post(`${backendUrl}user/login`, { username: email, password, remember })
            .then((res) => {
                if (res.data.token) {
                    localStorage.setItem('user', JSON.stringify(res.data))
                }
                return res.data
            })
    }

    logout = () => { localStorage.removeItem('user') }

    getCurrentUser = () => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            return axios
                .post(`${backendUrl}user/verificar_login`, { token: authHeader() })
                .then((res) => {
                    if (res.data.success) {
                        return res.data.data
                    }
                    this.logout()
                    return window.location.reload()
                })
        }
        return false
    }
}

export default new AuthService()
