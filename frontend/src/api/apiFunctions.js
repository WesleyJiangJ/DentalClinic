import axios from 'axios'
import { sweetToast } from '../components/dashboard/Alerts';

const apiURL = import.meta.env.VITE_API_URL;

const createAPIInstance = (baseURL) => {
    const apiInstance = axios.create({
        baseURL: baseURL,
    });

    apiInstance.interceptors.request.use(async (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    apiInstance.interceptors.response.use((response) => {
        return response;
    }, async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            try {
                const response = await axios.post(`${apiURL}/api/token/refresh/`, {
                    refresh: refreshToken,
                });
                localStorage.setItem('access_token', response.data.access);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                return apiInstance(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // Go to Login page
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    });
    return apiInstance;
};

const userAPI = createAPIInstance(`${apiURL}/users/`);
const patientAPI = createAPIInstance(`${apiURL}/patient/`);
const medicalHistoryAPI = createAPIInstance(`${apiURL}/medicalhistory/`);
const personalAPI = createAPIInstance(`${apiURL}/personal/`);
const appointmentAPI = createAPIInstance(`${apiURL}/appointment/`);
const appointmentsAPI = createAPIInstance(`${apiURL}/appointments/`);
const treatmentAPI = createAPIInstance(`${apiURL}/treatment/`);
const budgetAPI = createAPIInstance(`${apiURL}/budget/`);
const paymentAPI = createAPIInstance(`${apiURL}/payment/`);
const paymentControlAPI = createAPIInstance(`${apiURL}/paymentcontrol/`);
const odontogramAPI = createAPIInstance(`${apiURL}/odontogram/`);
const odontogramTeethAPI = createAPIInstance(`${apiURL}/odontogramteeth/`);
const odontogramToothConditionAPI = createAPIInstance(`${apiURL}/odontogramtoothcondition/`);
const notesAPI = createAPIInstance(`${apiURL}/notes/`);
const emailAPI = createAPIInstance(`${apiURL}/send-email/`);
const fileAPI = createAPIInstance(`${apiURL}/files/`);
const exportAPI = createAPIInstance(`${apiURL}/export-database/`);
const importAPI = createAPIInstance(`${apiURL}/import-database/`);
const contentTypeAPI = createAPIInstance(`${apiURL}/content-type/`);

// User
export const getUser = (email) => {
    return userAPI.get(`?email=${email}`);
}

export const patchUser = (id, data) => {
    return userAPI.patch(`/${id}/`, data);
}

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

// Email
export const postEmail = (data) => {
    return emailAPI.post('/', data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
}

// Files
export const postFile = (data) => {
    return fileAPI.post('/', data);
}

export const getFiles = (model, id) => {
    return fileAPI.get(`?content_type__app_label=api&content_type__model=${model}&object_id=${id}`);
}

export const deleteFile = (id) => {
    return fileAPI.delete(`/${id}/`);
}

// Content Type
export const getContentType = (app_label, model_name) => {
    return contentTypeAPI.get(`${app_label}/${model_name}/`);
}

// Export Database
export const exportDatabase = async () => {
    try {
        const response = await exportAPI.get('/', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `backup_${new Date().toDateString()}.dump`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        sweetToast('error', 'Ha ocurrido un error');
    }
}

// Import Database
export const importDatabase = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        await importAPI.post('/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).catch((error) => console.log(error));
    } catch (error) {
        sweetToast('error', 'Ha ocurrido un error');
    }
};