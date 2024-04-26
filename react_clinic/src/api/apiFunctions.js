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

const appointmentsAPI = axios.create({
    baseURL: 'http://localhost:8000/appointments/'
})

const treatmentAPI = axios.create({
    baseURL: 'http://localhost:8000/treatment/'
})

const budgetAPI = axios.create({
    baseURL: 'http://localhost:8000/budget/'
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

// Appointment
export const getAllAppointments = () => {
    return appointmentAPI.get('/')
}

export const getSpecificAppointment = (id) => {
    return appointmentAPI.get(`/${id}`)
}

export const getAllAppointmentsByPatient = (id) => {
    return appointmentsAPI.get(`?id_patient=${id}`)
}

export const putAppointment = (id, data) => {
    return appointmentAPI.put(`/${id}/`, data)
}

export const postAppointment = (data) => {
    return appointmentAPI.post('/', data)
}

// Treatment
export const getAllTreatment = () => {
    return treatmentAPI.get('/')
}

export const getSpecificTreatment = (id) => {
    return treatmentAPI.get(`/${id}`)
}

export const putTreatment = (id, data) => {
    return treatmentAPI.put(`/${id}/`, data)
}

export const postTreatment = (data) => {
    return treatmentAPI.post('/', data)
}

// Budget
export const getAllBudget = () => {
    return budgetAPI.get('/')
}