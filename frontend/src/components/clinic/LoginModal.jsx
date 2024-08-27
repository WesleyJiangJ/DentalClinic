import { useNavigate } from 'react-router-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

export default function LoginModal({ isOpen, onOpenChange }) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard');
    };

    return (
        <>
            <Modal
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                size="2xl"
                radius="sm">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div>
                                    <ModalHeader className="flex flex-col gap-1">Bienvenido</ModalHeader>
                                    <ModalBody>
                                        <Input
                                            autoFocus
                                            label="Correo"
                                            type="email"
                                            placeholder="Ingresa tu correo"
                                            variant="bordered"
                                            radius="sm"
                                        />
                                        <Input
                                            label="Contraseña"
                                            placeholder="Ingresa tu contraseña"
                                            type="password"
                                            variant="bordered"
                                            radius="sm"
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="flat"
                                            radius="sm"
                                            onPress={onClose}>
                                            Cerrar
                                        </Button>
                                        <Button
                                            color='primary'
                                            radius="sm"
                                            onPress={handleClick}>
                                            Iniciar Sesión
                                        </Button>

                                    </ModalFooter>
                                </div>

                                <div className="hidden lg:inline">
                                    <img
                                        className="w-full"
                                        src="../images/Login.webp"
                                        alt="Login Image" />
                                </div>
                            </div>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}