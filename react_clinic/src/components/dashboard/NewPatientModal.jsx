import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, CheckboxGroup, Checkbox, Textarea } from "@nextui-org/react";

export default function NewPatientModal({ isOpen, onOpenChange }) {
    const [firstName, setFirstName] = React.useState('');
    const [secondName, setSecondName] = React.useState('');
    const [firstLastName, setFirstLastName] = React.useState('');
    const [secondLastName, setSecondLastName] = React.useState('');
    const [birthdate, setBirthdate] = React.useState('');
    const [gender, setGender] = React.useState('F');
    const [email, setEmail] = React.useState('');
    const [phonenumber1, setPhoneNumber1] = React.useState('');
    const [states, setStates] = React.useState('BOA');
    const [address, setAddress] = React.useState('');
    const [maritalstatus, setMaritalStatus] = React.useState('single');
    const [occupation, setOccupation] = React.useState('');
    const [emergencyContactName, setEmergencyContactName] = React.useState('');
    const [phonenumber2, setPhoneNumber2] = React.useState('');
    const [isSecondModalOpen, setSecondModalOpen] = React.useState(false);
    const [record, setRecord] = React.useState([]);
    const [observations, setObservations] = React.useState("");

    const handleInputChangeInfo = (e, setInputFunction) => {
        const input = e.target.value;
        setInputFunction(input);
        console.log(input)
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
        setRecord(selectedValues);
        // console.log(selectedValues)
    };

    const openSecondModal = () => {
        setSecondModalOpen(true);
        onOpenChange(false);
    };

    const closeSecondModal = () => {
        setSecondModalOpen(false);
    };

    const previousModal = () => {
        onOpenChange(true);
        closeSecondModal();
    }


    const genders = [
        { label: "Femenino", value: "F" },
        { label: "Masculino", value: "M" },
    ]

    const departamentosNicaragua = [
        { label: "Boaco", value: "BOA" },
        { label: "Carazo", value: "CAR" },
        { label: "Chinandega", value: "CHI" },
        { label: "Chontales", value: "CHO" },
        { label: "Estelí", value: "EST" },
        { label: "Granada", value: "GRA" },
        { label: "Jinotega", value: "JIN" },
        { label: "León", value: "LEO" },
        { label: "Madriz", value: "MAD" },
        { label: "Managua", value: "MGA" },
        { label: "Masaya", value: "MAS" },
        { label: "Matagalpa", value: "MTA" },
        { label: "Nueva Segovia", value: "NSE" },
        { label: "Río San Juan", value: "RSJ" },
        { label: "Rivas", value: "RIV" },
    ];

    const maritalStatus = [
        { label: "Soltero", value: "single" },
        { label: "Casado", value: "married" },
        { label: "Divorciado", value: "divorced" },
        { label: "Viudo", value: "widowed" },
        { label: "Unión Libre", value: "commonLaw" },
        { label: "Separado", value: "separated" },
    ];

    const antecedentesDict = [
        { label: "Alergias", value: "alergias" },
        { label: "Patológico", value: "patologico" },
        { label: "Farmacológico", value: "farmacologico" },
        { label: "Hospitalización", value: "hospitalizacion" },
        { label: "Cirugía", value: "cirugia" },
        { label: "Transfusión", value: "transfusion" },
        { label: "Radioterapia", value: "radioterapia" },
        { label: "Quimioterapia", value: "quimioterapia" },
        { label: "Hábito", value: "habito" },
    ];

    const resetForm = () => {
        setFirstName("");
        setSecondName("");
        setFirstLastName("");
        setSecondLastName("");
        setBirthdate("");
        setGender("F");
        setEmail("");
        setPhoneNumber1("");
        setStates("BOA");
        setAddress("");
        setMaritalStatus("single");
        setOccupation("");
        setEmergencyContactName("");
        setPhoneNumber2("");
        setRecord([]);
        setObservations("");
    };

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
                backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Nuevo Paciente</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-2 md:flex-row">
                                    <Input
                                        autoFocus
                                        type="text"
                                        label="Primer Nombre"
                                        variant="underlined"
                                        value={firstName}
                                        onChange={(e) => handleInputChangeInfo(e, setFirstName)}
                                    />
                                    <Input
                                        type="text"
                                        label="Segundo Nombre"
                                        variant="underlined"
                                        value={secondName}
                                        onChange={(e) => handleInputChangeInfo(e, setSecondName)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row">
                                    <div className="w-full">
                                        <Input
                                            type="text"
                                            label="Primer Apellido"
                                            variant="underlined"
                                            value={firstLastName}
                                            onChange={(e) => handleInputChangeInfo(e, setFirstLastName)}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Input
                                            type="text"
                                            label="Segundo Apellido"
                                            variant="underlined"
                                            value={secondLastName}
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
                                        value={phonenumber1}
                                        onChange={(e) => handleInputChange(e, setPhoneNumber1)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row">
                                    <Select
                                        label="Departamentos"
                                        variant="underlined"
                                        value={states}
                                        onChange={(e) => handleInputChangeInfo(e, setStates)}
                                        defaultSelectedKeys={[states]}>
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
                                        value={maritalstatus}
                                        onChange={(e) => handleInputChangeInfo(e, setMaritalStatus)}
                                        defaultSelectedKeys={[maritalstatus]}>
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
                                        value={emergencyContactName}
                                        onChange={(e) => handleInputChangeInfo(e, setEmergencyContactName)}
                                    />
                                    <Input
                                        label="Celular"
                                        variant="underlined"
                                        type="text"
                                        value={phonenumber2}
                                        onChange={(e) => handleInputChange(e, setPhoneNumber2)}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={openSecondModal} radius="sm">
                                    Siguiente
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isSecondModalOpen}
                onOpenChange={() => {
                    closeSecondModal();
                    resetForm();
                }}
                placement="top-center"
                size="5xl"
                radius="sm"
                backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Historial Médico</ModalHeader>
                            <ModalBody>
                                <CheckboxGroup
                                    orientation="horizontal"
                                    label="Antecedentes"
                                    value={record}
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
                                    value={observations}
                                    onChange={(e) => handleInputChangeInfo(e, setObservations)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="warning" onPress={previousModal} radius="sm">
                                    Anterior
                                </Button>
                                <Button color="primary" onPress={onClose} radius="sm">
                                    Siguiente
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}