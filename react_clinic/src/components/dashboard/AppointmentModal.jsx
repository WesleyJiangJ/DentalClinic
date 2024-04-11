import React from "react";
import { sweetAlert, sweetToast } from "./Alerts";
import { getAllPatients, getAllPersonal, getSpecificAppointment, postAppointment, putAppointment } from "../../api/apiFunctions";
import { Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from "@nextui-org/react";

export default function AppointmentModal({ isOpen, onOpenChange, reloadData, param, modifyURL }) {
    const [patientData, setPatientData] = React.useState([]);
    const [id_patient, setIdPatient] = React.useState('');
    const [patientName, setPatientName] = React.useState('');
    const [personalData, setPersonalData] = React.useState([]);
    const [id_personal, setIdPersonal] = React.useState('');
    const [personalName, setPersonalName] = React.useState('');
    const [dateValue, setDateValue] = React.useState('');
    const [timeValue, setTimeValue] = React.useState('');
    const [reason, setReason] = React.useState('');
    const [observation, setObservation] = React.useState('');
    const readOnly = param.slug === 'check';

    const [prevData, setPrevData] = React.useState({
        reason: '',
        datetime: ''
    });
    let change = [];

    const loadData = async () => {
        if (param.id) {
            const res = await getSpecificAppointment(param.id);
            setPatientName(res.data['patient_data'].first_name + ' ' + res.data['patient_data'].middle_name + ' ' + res.data['patient_data'].first_lastname + ' ' + res.data['patient_data'].second_lastname);
            setIdPatient(res.data.id_patient);
            setPersonalName(res.data['personal_data'].first_name + ' ' + res.data['personal_data'].middle_name + ' ' + res.data['personal_data'].first_lastname + ' ' + res.data['personal_data'].second_lastname);
            setIdPersonal(res.data.id_personal);
            setReason(res.data.reason);
            const formattedDate = new Date(res.data.datetime).toISOString().split('T')[0];
            const formattedTime = new Date(res.data.datetime).toISOString().split('T')[1].slice(0, 5);
            setDateValue(formattedDate);
            setTimeValue(formattedTime);
            setPrevData({
                ...prevData,
                datetime: formattedDate + ' ' + formattedTime,
                reason: res.data.reason
            });
        }
        else {
            const patientRes = await getAllPatients();
            const personalRes = await getAllPersonal();
            setPatientData(patientRes.data);
            setPersonalData(personalRes.data);
        }
    }

    React.useEffect(() => {
        loadData();
    }, [param.id]);

    const handleInputChange = (e, setInputFunction) => {
        const input = e.target.value;
        setInputFunction(input);
    }

    const formData = {
        id_patient,
        id_personal,
        datetime: dateValue + ' ' + timeValue,
        reason,
        status: 1,
        observation,
    }

    const resetForm = () => {
        setIdPatient("");
        setIdPersonal("");
        setDateValue("");
        setTimeValue("");
        setReason("");
        setObservation("")
        if (param.id) {
            modifyURL();
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (param.id) {
                let dateArray = [];
                let timeArray = [];
                for (const key in prevData) {
                    dateArray.push(new Date(prevData['datetime']).toISOString().split('T')[0]);
                    timeArray.push(new Date(prevData['datetime']).toISOString().split('T')[1].slice(0, 5));
                    dateArray.push(new Date(formData['datetime']).toISOString().split('T')[0]);
                    timeArray.push(new Date(formData['datetime']).toISOString().split('T')[1].slice(0, 5));

                    if (prevData[key] !== formData[key]) {
                        if (key === "reason") {
                            change.push("motivo");
                        }
                        else if (key === "datetime") {
                            if (dateArray[0] !== dateArray[1] && timeArray[0] !== timeArray[1]) {
                                change.push("fecha y hora");
                            }
                            else {
                                if (dateArray[0] !== dateArray[1]) {
                                    change.push("fecha");
                                }
                                if (timeArray[0] !== timeArray[1]) {
                                    change.push("hora");
                                }
                            }
                        }
                    }
                }
                if (change.length > 0 || param.slug === "check") {
                    await sweetAlert('¿Estás seguro?', (param.slug === "edit" ? `¿Deseas modificar ${change.join(', ')}?` : '¿Desea marcarla como realizada?'), 'warning', 'success', (param.slug === 'edit' ? 'Actualizado' :  "Cita realizada"));
                    if (param.slug === 'check') {
                        formData.status = 3;
                        await putAppointment(param.id, formData);
                    }
                    else {
                        await putAppointment(param.id, formData);
                    }
                }
                else {
                    sweetToast('warning', 'No se realizaron modificaciones')
                }
            }
            else {
                await postAppointment(formData);
                sweetToast('success', `Se ha agregado ${reason}`);
            }
            reloadData();
            resetForm();
            onOpenChange(false);
        } catch (error) {
            console.log(error);
        }
    }

    const cancelAppointment = async () => {
        await sweetAlert("¿Deseas cancelar la cita?", "", "warning", "success", "La cita fue cancelada")
        formData.status = 2;
        putAppointment(param.id, formData)
            .then(() => {
                reloadData();
            })
            .catch((error) => {
                console.error('Error: ', error);
            })
        resetForm();
        onOpenChange(false);
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={() => {
                    onOpenChange(true);
                    resetForm();
                }}
                placement="top-center"
                size="5xl"
                radius="sm"
                backdrop="blur"
                isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <ModalHeader className="flex flex-col gap-1">
                                    {param.id
                                        ?
                                        param.slug === "edit" ? "Modificar Cita" : `Marcar ${reason.toLowerCase()} como realizada`
                                        :
                                        "Nueva Cita"
                                    }
                                </ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-5">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {param.id
                                                ?
                                                <Input
                                                    readOnly
                                                    value={patientName}
                                                    variant="underlined"
                                                />
                                                :
                                                <Select
                                                    label="Paciente"
                                                    variant="underlined"
                                                    value={id_patient}
                                                    onChange={(e) => handleInputChange(e, setIdPatient)}>
                                                    {patientData.map((patient) => (
                                                        <SelectItem key={patient.id} value={patient.id} textValue={patient.first_name + ' ' + patient.middle_name + ' ' + patient.first_lastname + ' ' + patient.second_lastname}>
                                                            {patient.first_name} {patient.middle_name} {patient.first_lastname} {patient.second_lastname}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            }
                                            {param.id
                                                ?
                                                <Input
                                                    readOnly
                                                    value={personalName}
                                                    variant="underlined"
                                                    startContent={"Dr. "}
                                                />
                                                :
                                                <Select
                                                    label="Doctor"
                                                    variant="underlined"
                                                    value={id_personal}
                                                    onChange={(e) => handleInputChange(e, setIdPersonal)}>
                                                    {personalData.map((personal) => (
                                                        <SelectItem key={personal.id} value={personal.id} textValue={personal.first_name + ' ' + personal.middle_name + ' ' + personal.first_lastname + ' ' + personal.second_lastname}>
                                                            {personal.first_name} {personal.middle_name} {personal.first_lastname} {personal.second_lastname}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            }
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <Input
                                                label="Fecha"
                                                placeholder=" "
                                                type="date"
                                                variant="underlined"
                                                value={dateValue}
                                                onChange={(e) => handleInputChange(e, setDateValue)}
                                                min={new Date().toISOString().split("T")[0]}
                                                readOnly={readOnly}
                                            />
                                            <Input
                                                label="Hora"
                                                placeholder=" "
                                                type="time"
                                                variant="underlined"
                                                value={timeValue}
                                                onChange={(e) => handleInputChange(e, setTimeValue)}
                                                min="09:00"
                                                max="17:00"
                                                readOnly={readOnly}
                                            />
                                        </div>
                                        <Textarea
                                            label={param.slug === "edit" || !param.slug ? 'Motivo' : "Observaciones"}
                                            placeholder="Escriba aquí . . ."
                                            size="lg"
                                            radius="sm"
                                            value={param.slug === "edit" || !param.slug ? reason : observation}
                                            onChange={(e) => handleInputChange(e, param.slug === "edit" || !param.slug ? setReason : setObservation)}
                                        />
                                    </div>
                                </ModalBody>
                                <ModalFooter className={param.id && param.slug === "edit" ? "flex justify-between" : ""}>
                                    {param.id && param.slug === "edit" ?
                                        <Button color="danger" radius="sm" variant="solid" onPress={cancelAppointment}>
                                            Cancelar Cita
                                        </Button>
                                        :
                                        ""
                                    }
                                    <div>
                                        <Button color="danger" radius="sm" variant="light" onPress={onClose}>
                                            Cerrar
                                        </Button>
                                        <Button className="bg-[#1E1E1E] text-white ml-2" radius="sm" type="submit">
                                            {param.id ? (param.slug === 'edit' ? 'Reprogramar' : 'Realizada') : 'Agendar'}
                                        </Button>
                                    </div>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}