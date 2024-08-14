import React from "react";
import { postOdontogram } from "../../api/apiFunctions";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { sweetToast } from './Alerts'

export default function NewOdontogramModal({ isOpen, onOpenChange, id_patient, navigate }) {
    const [isInvalid, setIsInvalid] = React.useState(false);
    const [name, setName] = React.useState('');

    const handleInputChange = (e) => {
        const input = e.target.value;
        setName(input);
        if (input === '') {
            setIsInvalid(true);
        } else {
            setIsInvalid(false);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (name === '') {
            setIsInvalid(true);
        } else {
            await postOdontogram({ name: name, id_patient: id_patient }).
                then((res) => {
                    navigate(`/dashboard/patient/odontogram/${res.data.id}`);
                    sweetToast('success', 'Odontograma creado');
                });
            setIsInvalid(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" radius="sm">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Nuevo Odontograma</ModalHeader>
                        <form onSubmit={handleSubmit}>
                            <ModalBody>
                                <Input variant="underlined" label='Nombre' value={name} onChange={(e) => handleInputChange(e)} isInvalid={isInvalid} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" radius="sm" variant="light" onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button color="primary" radius="sm" type="submit">
                                    Crear
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}