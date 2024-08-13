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

const paymentAPI = axios.create({
    baseURL: 'http://localhost:8000/payment/'
})

const paymentControlAPI = axios.create({
    baseURL: 'http://localhost:8000/paymentcontrol/'
})

const odontogramTeethAPI = axios.create({
    baseURL: 'http://localhost:8000/odontogramteeth/'
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

export const getAllAppointmentsByUser = (id_patient, id_personal) => {
    return appointmentsAPI.get(`?id_patient=${id_patient}&id_personal=${id_personal}`)
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

export const getSpecificBudget = (id) => {
    return budgetAPI.get(`/${id}`)
}

export const getAllBudgetByPatient = (id) => {
    return budgetAPI.get(`?id_patient=${id}`)
}

export const putBudget = (id, data) => {
    return budgetAPI.put(`/${id}/`, data)
}

export const postBudget = (data) => {
    return budgetAPI.post('/', data)
}

// Payment
export const getAllPayment = () => {
    return paymentAPI.get('/')
}

export const getSpecificPayment = (id) => {
    return paymentAPI.get(`/${id}`)
}

export const getAllPaymentsByPatient = (id) => {
    return paymentAPI.get(`?id_budget__id_patient=${id}`)
}

export const putPayment = (id, data) => {
    return paymentAPI.put(`/${id}/`, data)
}

export const postPayment = (data) => {
    return paymentAPI.post('/', data)
}

// Payment Control
export const getAllPaymentControl = () => {
    return paymentControlAPI.get('/')
}

export const postPaymentControl = (data) => {
    return paymentControlAPI.post('/', data)
}

// Odontogram
export const getOdontogramTeeth = (id, tooth) => {
    return odontogramTeethAPI.get(`?id_odontogram=${id}&tooth_number=${tooth}`)
}

export const postOdontogramTeeth = (data) => {
    return odontogramTeethAPI.post('/', data)
}

export const odontogramSurfaceTeethDelete = (id) => {
    return odontogramTeethAPI.delete(`/${id}/`);
}