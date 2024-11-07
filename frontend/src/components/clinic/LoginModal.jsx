import React from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

export default function LoginModal({ isOpen, onOpenChange }) {
    const apiURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [isVisiblePassword, setIsVisiblePassword] = React.useState(false);
    const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);
    const [isLoading, setIsLoading] = React.useState(false);
    const { control, handleSubmit, formState: { errors }, reset, setError } = useForm({
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${apiURL}/api/token/`, {
                username: data.username,
                password: data.password,
            });
            setIsLoading(false);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            // Decode Token
            const decodedToken = jwtDecode(response.data.access);
            localStorage.setItem('name', decodedToken.name);
            reset();
            if (decodedToken.groups.includes('PersonalGroup')) {
                navigate('/dashboard');
            }
            else {
                navigate(`/dashboard/patient/detail/${decodedToken.id}`);
            }
        } catch (error) {
            reset();
            setError('username');
            setError('password', { message: error.response.data.detail });
            setIsLoading(false);
        }
    };

    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            onOpenChange={() => {
                onOpenChange(true);
                reset();
            }}
            placement="top-center"
            size="2xl"
            radius="sm">
            <ModalContent>
                {(onClose) => (
                    <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className='flex flex-col'>
                                    <ModalHeader className="flex flex-col gap-1">Bienvenido</ModalHeader>
                                    <ModalBody>
                                        <Controller
                                            name="username"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    autoFocus
                                                    label="Usuario"
                                                    type="text"
                                                    placeholder="Ingresa tu usuario"
                                                    variant="underlined"
                                                    startContent={<UserIcon className='w-5 h-5' />}
                                                    isInvalid={errors.username ? true : false}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="password"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="Contraseña"
                                                    placeholder="Ingresa tu contraseña"
                                                    type={isVisiblePassword ? "text" : "password"}
                                                    variant="underlined"
                                                    startContent={<LockClosedIcon className='w-5 h-5' />}
                                                    errorMessage={errors?.password?.message}
                                                    endContent={
                                                        <Button className="focus:outline-none bg-white" type="button" isIconOnly onClick={toggleVisibility}>
                                                            {isVisiblePassword ? (
                                                                <EyeIcon className="w-5 h-5" />
                                                            ) : (
                                                                <EyeSlashIcon className="w-5 h-5" />
                                                            )}
                                                        </Button>
                                                    }
                                                    isInvalid={errors.password ? true : false}
                                                />
                                            )}
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="light"
                                            radius="sm"
                                            size='md'
                                            onPress={onClose}>
                                            Cerrar
                                        </Button>
                                        <Button
                                            color='primary'
                                            radius="sm"
                                            fullWidth
                                            size='md'
                                            isLoading={isLoading}
                                            type='submit'>
                                            Iniciar Sesión
                                        </Button>
                                    </ModalFooter>
                                </div>
                                <div className="hidden md:inline">
                                    <img
                                        className="w-full"
                                        src="../images/Login.webp"
                                        alt="Login Image" />
                                </div>
                            </div>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal >
    );
}