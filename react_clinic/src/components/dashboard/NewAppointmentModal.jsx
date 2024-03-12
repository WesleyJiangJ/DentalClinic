import React from "react";
import { Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from "@nextui-org/react";

export default function NewAppointmentModal({ isOpen, onOpenChange }) {
    const patients = [
        { label: "Génesis Rashel Téllez Vargas", value: "1" },
        { label: "Wesley Wen Jiang Jacamo", value: "2" },
    ]
    const doctors = [
        { label: "Lucia del Socorro Rodriguez Vargas", value: "1" },
        { label: "Wendy Walkiria Jácamo Rodriguez", value: "2" },
    ]
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
                            <ModalHeader className="flex flex-col gap-1">Nueva Cita</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <Select
                                            label="Paciente"
                                            variant="underlined">
                                            {patients.map((patient) => (
                                                <SelectItem key={patient.value} value={patient.value}>
                                                    {patient.label}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <Select
                                            label="Doctor"
                                            variant="underlined">
                                            {doctors.map((doctor) => (
                                                <SelectItem key={doctor.value} value={doctor.value}>
                                                    {doctor.label}
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
                                        />
                                        <Input
                                            label="Hora"
                                            placeholder="a"
                                            type="time"
                                            variant="underlined"
                                        />
                                    </div>
                                    <Textarea
                                        label="Observaciones"
                                        placeholder="Escriba aquí . . ."
                                        size="lg"
                                        radius="sm"
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Agendar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
