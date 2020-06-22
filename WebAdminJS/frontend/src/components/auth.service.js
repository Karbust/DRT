import axios from 'axios'
import authHeader from './auth-header'
import { backendUrl } from '../configs'

class AuthService {
    login (username, password, remember) {
        return axios
            .post(backendUrl + 'user/login', { username, password, remember })
            .then(res => {
                if (res.data.token) {
                    localStorage.setItem('user', JSON.stringify(res.data))
                }
                return res.data
            })
    }

    logout () { localStorage.removeItem('user') }
    getCurrentUser () {
        let user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            return axios
                .post(backendUrl + 'user/verificar_login', { token: authHeader() })
                .then(res => {
                    if (res.data.success) {
                        //console.log(res.data.data)
                        return res.data.data
                    } else {
                        this.logout()
                        window.location.reload()
                    }
                })
        } else {
            return false
        }
    }
}

export default new AuthService()
