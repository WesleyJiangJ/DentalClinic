import axios from 'axios'

const patientAPI = axios.create({
    baseURL: 'http://localhost:8000/patient/'
})

const medicalHistoryAPI = axios.create({
    baseURL: 'http://localhost:8000/medicalhistory/'
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

const odontogramAPI = axios.create({
    baseURL: 'http://localhost:8000/odontogram/'
})

const odontogramTeethAPI = axios.create({
    baseURL: 'http://localhost:8000/odontogramteeth/'
})

const odontogramToothConditionAPI = axios.create({
    baseURL: 'http://localhost:8000/odontogramtoothcondition/'
})

const notesAPI = axios.create({
    baseURL: 'http://localhost:8000/notes/'
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
    return patientAPI.post('/', data)
}

// Medical History
export const getMedicalHistory = (id) => {
    return medicalHistoryAPI.get(`?id_patient=${id}`)
}

export const postMedicalHistory = (data) => {
    return medicalHistoryAPI.post('/', data)
}

export const putMedicalHistory = (id, data) => {
    return medicalHistoryAPI.put(`/${id}/`, data)
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

export const patchBudget = (id, data) => {
    return budgetAPI.patch(`/${id}/`, data)
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

export const getPaymentControlFiltered = (startDate, endDate) => {
    return paymentControlAPI.get(`?start_date=${startDate}&end_date=${endDate}`)
}

// Odontogram
export const getOdontogram = (id_odontogram, id_patient) => {
    return odontogramAPI.get(`?id=${id_odontogram}&id_patient=${id_patient}`)
}

export const postOdontogram = (data) => {
    return odontogramAPI.post('/', data)
}

export const deleteOdontogram = (id) => {
    return odontogramAPI.delete(`/${id}/`);
}

// Odontogram Tooth
export const getOdontogramTeeth = (id, tooth) => {
    return odontogramTeethAPI.get(`?id_odontogram=${id}&tooth_number=${tooth}`)
}

export const postOdontogramTeeth = (data) => {
    return odontogramTeethAPI.post('/', data)
}

export const odontogramSurfaceTeethDelete = (id) => {
    return odontogramTeethAPI.delete(`/${id}/`);
}

// Odontogram Tooth Condition
export const getAllOdontogramToothCondition = () => {
    return odontogramToothConditionAPI.get('/')
}

export const getSpecificOdontogramToothCondition = (id) => {
    return odontogramToothConditionAPI.get(`/${id}`)
}

export const postOdontogramToothCondition = (data) => {
    return odontogramToothConditionAPI.post('/', data)
}

export const putOdontogramToothCondition = (id, data) => {
    return odontogramToothConditionAPI.put(`/${id}/`, data)
}

// Notes
export const postNote = (data) => {
    return notesAPI.post('/', data);
}

export const getNotes = (model, id) => {
    return notesAPI.get(`?content_type__app_label=api&content_type__model=${model}&object_id=${id}`);
}

export const getNote = (model, id, noteID) => {
    return notesAPI.get(`?content_type__app_label=api&content_type__model=${model}&object_id=${id}&id=${noteID}`);
}

export const deleteNote = (id) => {
    return notesAPI.delete(`/${id}/`);
}