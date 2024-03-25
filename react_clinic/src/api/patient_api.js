import axios from 'axios'

const patientAPI = axios.create({
    baseURL: 'http://localhost:8000/patient/'
})

const addPatientAPI = axios.create({
    baseURL: 'http://localhost:8000/new_patient/'
})

export const getAllPatients = () => {
    console.log(patientAPI.get('/'))
    return patientAPI.get('/')
}

export const postNewPatient = (patient) => {
    return addPatientAPI.post('/', patient)
}