import axios from 'axios'
import authHeader from './auth-header'

class AuthService {
    login (username, password, remember) {
        return axios
            .post('http://localhost:5000/user/login', { username, password, remember })
            .then(res => {
                if (res.data.token) {
                    localStorage.setItem('user', JSON.stringify(res.data))
                }
                return res.data
            })
    }

    logout () { localStorage.removeItem('user') }
    getCurrentUser () {
        if (JSON.parse(localStorage.getItem('user'))) {
            const token = authHeader()
            return axios
                .post('http://localhost:5000/user/verifylogin', { token })
                .then(res => {
                    if (!res.data.success) {
                        this.logout()
                        window.location.reload()
                    }
                })
        } else { return false }
    }
}

export default new AuthService()
