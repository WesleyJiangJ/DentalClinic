import axios from 'axios'

const patientAPI = axios.create({
    baseURL: 'http://localhost:8000/patient/'
})

export const getAllPatients = () => {
    return patientAPI.get('/')
}

export const postNewPatient = (patient) => {
    return patientAPI.post('/', patient)
}