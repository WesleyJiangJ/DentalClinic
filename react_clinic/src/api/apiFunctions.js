import axios from 'axios'

const patientAPI = axios.create({
    baseURL: 'http://localhost:8000/patient/'
})

const addPatientAPI = axios.create({
    baseURL: 'http://localhost:8000/new_patient/'
})

const personalAPI = axios.create({
    baseURL: 'http://localhost:8000/personal/'
})

const appointmentAPI = axios.create({
    baseURL: 'http://localhost:8000/appointment/'
})

// Patient
export const getAllPatients = () => {
    return patientAPI.get('/')
}

export const getSpecificPatient = (id) => {
    return patientAPI.get(`/${id}`)
}

export const putPatient = (id, data) => {
    return patientAPI.put(`/${id}/`, data)
}

export const postPatient = (data) => {
    return addPatientAPI.post('/', data)
}

// Personal
export const getAllPersonal = () => {
    return personalAPI.get('/')
}

export const getSpecificPersonal = (id) => {
    return personalAPI.get(`/${id}`)
}

export const putPersonal = (id, data) => {
    return personalAPI.put(`/${id}/`, data)
}

export const postPersonal = (data) => {
    return personalAPI.post('/', data)
}