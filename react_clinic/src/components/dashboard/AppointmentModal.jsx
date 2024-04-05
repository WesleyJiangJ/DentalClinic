import React from "react";
import { useParams } from "react-router-dom";
import { getAllPatients, getAllPersonal, postAppointment } from "../../api/apiFunctions";
import { Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from "@nextui-org/react";

export default function AppointmentModal({ isOpen, onOpenChange }) {
    const [patientData, setPatientData] = React.useState([]);
    const [id_patient, setIdPatient] = React.useState('');
    const [personalData, setPersonalData] = React.useState([]);
    const [id_personal, setIdPersonal] = React.useState('');
    const [dateValue, setDateValue] = React.useState('');
    const [timeValue, setTimeValue] = React.useState('');
    const [observation, setObservation] = React.useState('');
    const param = useParams();

    const loadData = async () => {
        const patientRes = await getAllPatients();
        const personalRes = await getAllPersonal();
        setPatientData(patientRes.data);
        setPersonalData(personalRes.data);
    }

    React.useEffect(() => {
        loadData();
    }, []);

    const handleInputChange = (e, setInputFunction) => {
        const input = e.target.value;
        setInputFunction(input);
    }

    const formData = {
        id_patient,
        id_personal,
        datetime: dateValue + ' ' + timeValue,
        observation,
    }

    const resetForm = () => {
        setIdPatient("");
        setIdPersonal("");
        setDateValue("");
        setTimeValue("");
        setObservation("");
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);
        try {
            if (param.id) {
                console.log("Editing");
            }
            else {
                await postAppointment(formData);
                console.log("Creating");
            }
            resetForm();
            onOpenChange(false)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                size="5xl"
                radius="sm"
                backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <ModalHeader className="flex flex-col gap-1">Nueva Cita</ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-5">
                                        <div className="flex flex-col md:flex-row gap-4">
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
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <Input
                                                label="Fecha"
                                                placeholder="a"
                                                type="date"
                                                variant="underlined"
                                                value={dateValue}
                                                onChange={(e) => handleInputChange(e, setDateValue)}
                                            />
                                            <Input
                                                label="Hora"
                                                placeholder="a"
                                                type="time"
                                                variant="underlined"
                                                value={timeValue}
                                                onChange={(e) => handleInputChange(e, setTimeValue)}
                                            />
                                        </div>
                                        <Textarea
                                            label="Observaciones"
                                            placeholder="Escriba aquí . . ."
                                            size="lg"
                                            radius="sm"
                                            value={observation}
                                            onChange={(e) => handleInputChange(e, setObservation)}
                                        />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Cerrar
                                    </Button>
                                    <Button color="primary" type="submit">
                                        Agendar
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
