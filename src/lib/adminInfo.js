import axios from 'axios'
import { parseJwt } from './jwt'


export async function fetchAdminInfo() {
    try {
        const token = localStorage.getItem('admin') // ensure the key 'token' is used as a string
        const { id } = parseJwt(token)

        const response = await axios.get(`/api/employee/attendance/${id}`)
        return response.data
    } catch (error) {
        console.error('Failed to fetch user info:', error)
        throw error
    }
}
