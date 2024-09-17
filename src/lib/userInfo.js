import axios from 'axios'
import { parseJwt } from './jwt'

export async function fetchUserInfo() {
    try {
        const token = localStorage.getItem('token') // ensure the key 'token' is used as a string
        const userId = parseJwt(token).userId

        const response = await axios.get(`/api/customer/${userId}`)
        return response.data
    } catch (error) {
        console.error('Failed to fetch user info:', error)
        throw error
    }
}
