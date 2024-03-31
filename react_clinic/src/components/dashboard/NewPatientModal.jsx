import React from "react";
import { sweetToast } from './Alerts'
import { postNewPatient, updatePatient, getSpecificPatient } from "../../api/patient_api";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, CheckboxGroup, Checkbox, Textarea } from "@nextui-org/react";
import { useParams } from "react-router-dom";

export default function NewPatientModal({ isOpen, onOpenChange, updateTable, updateData }) {
    const [first_name, setFirstName] = React.useState('');
    const [middle_name, setSecondName] = React.useState('');
    const [first_lastname, setFirstLastName] = React.useState('');
    const [second_lastname, setSecondLastName] = React.useState('');
    const [birthdate, setBirthdate] = React.useState('');
    const [gender, setGender] = React.useState('F');
    const [email, setEmail] = React.useState('');
    const [phone_number, setPhoneNumber1] = React.useState('');
    const [origin, setOrigin] = React.useState('BO');
    const [address, setAddress] = React.useState('');
    const [marital_status, setMaritalStatus] = React.useState('S');
    const [occupation, setOccupation] = React.useState('');
    const [emergency_contact, setEmergencyContactName] = React.useState('');
    const [emergency_number, setPhoneNumber2] = React.useState('');
    const [record, setRecord] = React.useState([]);
    const [observation, setObservations] = React.useState("");

    const genders = [
        { label: "Femenino", value: "F" },
        { label: "Masculino", value: "M" },
    ]

    const departamentosNicaragua = [
        { label: "Boaco", value: "BO" },
        { label: "Carazo", value: "CA" },
        { label: "Chinandega", value: "CI" },
        { label: "Chontales", value: "CO" },
        { label: "Estelí", value: "ES" },
        { label: "Granada", value: "GR" },
        { label: "Jinotega", value: "JI" },
        { label: "León", value: "LE" },
        { label: "Madriz", value: "MD" },
        { label: "Managua", value: "MN" },
        { label: "Masaya", value: "MS" },
        { label: "Matagalpa", value: "MT" },
        { label: "Nueva Segovia", value: "NS" },
        { label: "Río San Juan", value: "SJ" },
        { label: "Rivas", value: "RV" },
        { label: "Región Autónoma de la Costa Caribe Norte", value: "AN" },
        { label: "Región Autónoma de la Costa Caribe Sur", value: "AS" },
    ];

    const maritalStatus = [
        { label: "Soltero", value: "S" },
        { label: "Casado", value: "C" },
        { label: "Divorciado", value: "D" },
        { label: "Viudo", value: "V" },
        { label: "Unión Libre", value: "U" },
    ];

    const antecedentesDict = [
        { label: "Alergias", value: "allergies" },
        { label: "Patológico", value: "pathological" },
        { label: "Farmacológico", value: "pharmacological" },
        { label: "Hospitalización", value: "hospitalitazation" },
        { label: "Cirugía", value: "surgical" },
        { label: "Transfusión", value: "transfusion" },
        { label: "Radioterapia", value: "radiotherapy" },
        { label: "Quimioterapia", value: "chemotherapy" },
        { label: "Hábito", value: "habit" },
    ];

    const formData = {
        patient_data: {
            first_name,
            middle_name,
            first_lastname,
            second_lastname,
            birthdate,
            gender,
            email,
            phone_number,
            origin,
            address,
            marital_status,
            occupation,
            emergency_contact,
            emergency_number,
        },
        ...record,
        observation
    }

    const handleInputChangeInfo = (e, setInputFunction) => {
        const input = e.target.value;
        setInputFunction(input);
    }

    const handleInputChange = (e, setInputFunction) => {
        const input = e.target.value;
        if (/^\d*$/.test(input)) {
            if (input.length <= 8) {
                setInputFunction(input);
            }
        }
    };

    const handleRecordChange = (selectedValues) => {
        const updatedRecord = {
            allergies: false,
            pathological: false,
            pharmacological: false,
            hospitalitazation: false,
            surgical: false,
            transfusion: false,
            radiotherapy: false,
            chemotherapy: false,
            habit: false,
        };
        // Assign true to all checkboxes
        selectedValues.forEach((value) => {
            updatedRecord[value] = true;
        });
        setRecord(updatedRecord);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (param.id) {
                await updatePatient(param.id, formData.patient_data);
                updateData();
                onOpenChange(false);
            }
            else {
                await postNewPatient(formData);
                updateTable();
                handlePreviousModal();
                onOpenChange(false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const resetForm = () => {
        setFirstName("");
        setSecondName("");
        setFirstLastName("");
        setSecondLastName("");
        setBirthdate("");
        setGender("F");
        setEmail("");
        setPhoneNumber1("");
        setOrigin("BO");
        setAddress("");
        setMaritalStatus("S");
        setOccupation("");
        setEmergencyContactName("");
        setPhoneNumber2("");
        setRecord([]);
        setObservations("");
        handlePreviousModal();
    };

    // Show Second Modal and Previous Modal
    const [modalOpen, setModalOpen] = React.useState(true);
    const handleNextModal = () => {
        setModalOpen(false);
    };

    const handlePreviousModal = () => {
        setModalOpen(true);
    };

    const param = useParams();
    React.useEffect(() => {
        async function loadData() {
            if (param.id) {
                const res = await getSpecificPatient(param.id)
                setFirstName(res.data.first_name);
                setSecondName(res.data.middle_name)
                setFirstLastName(res.data.first_lastname)
                setSecondLastName(res.data.second_lastname)
                setBirthdate(res.data.birthdate)
                setGender(res.data.gender)
                setEmail(res.data.email)
                setPhoneNumber1(res.data.phone_number)
                setOrigin(res.data.origin)
                setAddress(res.data.address)
                setMaritalStatus(res.data.marital_status)
                setOccupation(res.data.occupation)
                setEmergencyContactName(res.data.emergency_contact)
                setPhoneNumber2(res.data.emergency_number)
            }
        }
        loadData();
    }, []);

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={() => {
                    onOpenChange(true);
                    { !param.id && resetForm(); }
                }}
                placement="top-center"
                size="5xl"
                radius="sm"
                backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                {modalOpen ? (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">{param.id ? 'Modificar Paciente' : 'Nuevo Paciente'}</ModalHeader>
                                        <ModalBody>
                                            <div className="flex flex-col gap-2 md:flex-row">
                                                <Input
                                                    autoFocus
                                                    type="text"
                                                    label="Primer Nombre"
                                                    variant="underlined"
                                                    value={first_name}
                                                    onChange={(e) => handleInputChangeInfo(e, setFirstName)}
                                                />
                                                <Input
                                                    type="text"
                                                    label="Segundo Nombre"
                                                    variant="underlined"
                                                    value={middle_name}
                                                    onChange={(e) => handleInputChangeInfo(e, setSecondName)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 md:flex-row">
                                                <div className="w-full">
                                                    <Input
                                                        type="text"
                                                        label="Primer Apellido"
                                                        variant="underlined"
                                                        value={first_lastname}
                                                        onChange={(e) => handleInputChangeInfo(e, setFirstLastName)}
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <Input
                                                        type="text"
                                                        label="Segundo Apellido"
                                                        variant="underlined"
                                                        value={second_lastname}
                                                        onChange={(e) => handleInputChangeInfo(e, setSecondLastName)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Input
                                                    label="Fecha de Nacimiento"
                                                    placeholder="a"
                                                    type="date"
                                                    variant="underlined"
                                                    value={birthdate}
                                                    onChange={(e) => handleInputChangeInfo(e, setBirthdate)}
                                                />
                                            </div>
                                            <div>
                                                <Select
                                                    label="Género"
                                                    variant="underlined"
                                                    value={gender}
                                                    onChange={(e) => handleInputChangeInfo(e, setGender)}
                                                    defaultSelectedKeys={[gender]}>
                                                    {genders.map((gender) => (
                                                        <SelectItem key={gender.value} value={gender.value}>
                                                            {gender.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="flex flex-col gap-2 md:flex-row">
                                                <Input
                                                    label="Correo"
                                                    variant="underlined"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => handleInputChangeInfo(e, setEmail)}
                                                />
                                                <Input
                                                    label="Celular"
                                                    variant="underlined"
                                                    type="text"
                                                    value={phone_number}
                                                    onChange={(e) => handleInputChange(e, setPhoneNumber1)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 md:flex-row">
                                                <Select
                                                    label="Departamentos"
                                                    variant="underlined"
                                                    value={origin}
                                                    onChange={(e) => handleInputChangeInfo(e, setOrigin)}
                                                    defaultSelectedKeys={[origin]}>
                                                    {departamentosNicaragua.map((nic) => (
                                                        <SelectItem key={nic.value} value={nic.value}>
                                                            {nic.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                                <Input
                                                    label="Dirección"
                                                    variant="underlined"
                                                    type="text"
                                                    value={address}
                                                    onChange={(e) => handleInputChangeInfo(e, setAddress)}
                                                />
                                            </div>
                                            <div>
                                                <Select
                                                    label="Estado Civil"
                                                    variant="underlined"
                                                    value={marital_status}
                                                    onChange={(e) => handleInputChangeInfo(e, setMaritalStatus)}
                                                    defaultSelectedKeys={[marital_status]}>
                                                    {maritalStatus.map((statusM) => (
                                                        <SelectItem key={statusM.value} value={statusM.value}>
                                                            {statusM.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div>
                                                <Input
                                                    label="Ocupación"
                                                    variant="underlined"
                                                    type="text"
                                                    value={occupation}
                                                    onChange={(e) => handleInputChangeInfo(e, setOccupation)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 md:flex-row">
                                                <Input
                                                    label="Nombre de Contacto de Emergencia"
                                                    variant="underlined"
                                                    type="text"
                                                    value={emergency_contact}
                                                    onChange={(e) => handleInputChangeInfo(e, setEmergencyContactName)}
                                                />
                                                <Input
                                                    label="Celular"
                                                    variant="underlined"
                                                    type="text"
                                                    value={emergency_number}
                                                    onChange={(e) => handleInputChange(e, setPhoneNumber2)}
                                                />
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            {
                                                param.id ?
                                                    <Button className="bg-[#1E1E1E] text-white" radius="sm" type="submit" onPress={() => sweetToast("success", "Actualizado")}>
                                                        Actualizar
                                                    </Button>
                                                    :
                                                    <Button className="bg-[#1E1E1E] text-white" radius="sm" onPress={handleNextModal}>
                                                        Siguiente
                                                    </Button>
                                            }
                                        </ModalFooter>
                                    </>
                                ) : (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">Historial Médico</ModalHeader>
                                        <ModalBody>
                                            <CheckboxGroup
                                                orientation="horizontal"
                                                label="Antecedentes"
                                                // value={record}
                                                value={Object.keys(record).filter((key) => record[key])}
                                                onChange={handleRecordChange}>
                                                {antecedentesDict.map((antecedentes) => (
                                                    <Checkbox key={antecedentes.value} value={antecedentes.value}>
                                                        {antecedentes.label}
                                                    </Checkbox>
                                                ))}
                                            </CheckboxGroup>
                                            <Textarea
                                                label="Observaciones"
                                                placeholder="Escriba aquí . . ."
                                                radius="sm"
                                                className="w-full"
                                                value={observation}
                                                onChange={(e) => handleInputChangeInfo(e, setObservations)}
                                            />
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="warning" onPress={handlePreviousModal} radius="sm">
                                                Anterior
                                            </Button>
                                            <Button color="primary" type="submit" radius="sm">
                                                Guardar
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}