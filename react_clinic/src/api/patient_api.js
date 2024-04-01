import axios from 'axios'

const patientAPI = axios.create({
    baseURL: 'http://localhost:8000/patient/'
})

const addPatientAPI = axios.create({
    baseURL: 'http://localhost:8000/new_patient/'
})

const addPersonalAPI = axios.create({
    baseURL: 'http://localhost:8000/personal/'
})

// Patient
export const getAllPatients = () => {
    return patientAPI.get('/')
}

export const getSpecificPatient = (id) => {
    return patientAPI.get(`/${id}`)
}

export const updatePatient = (id, data) => {
    return patientAPI.put(`/${id}/`, data)
}

export const postNewPatient = (data) => {
    return addPatientAPI.post('/', data)
}

// Personal
export const getAllPersonal = () => {
    return addPersonalAPI.get('/')
}

export const getSpecificPersonal = (id) => {
    return addPersonalAPI.get(`/${id}`)
}

export const updatePersonal = (id, data) => {
    return addPersonalAPI.put(`/${id}/`, data)
}

export const postNewPersonal = (data) => {
    return addPersonalAPI.post('/', data)
}