import axios from 'axios'

const patientAPI = axios.create({
    baseURL: 'http://localhost:8000/patient/'
})

const addPatientAPI = axios.create({
    baseURL: 'http://localhost:8000/new_patient/'
})

export const getAllPatients = () => {
    return patientAPI.get('/')
}

export const getSpecificPatient = (id) => {
    return patientAPI.get(`/${id}`)
}

export const updatePatient = (id, data) => {
    return patientAPI.put(`/${id}/`, data)
}

export const postNewPatient = (patient) => {
    return addPatientAPI.post('/', patient)
}