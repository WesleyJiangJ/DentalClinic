import React from "react";
import { useForm, Controller } from "react-hook-form"
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { getSpecificTreatment, postTreatment, putTreatment } from "../../api/apiFunctions";
import { sweetAlert, sweetToast } from "./Alerts";

export default function TreatmentModal({ isOpen, onOpenChange, loadTreatments, param, modifyURL }) {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: '',
            description: '',
            price: ''
        }
    });
    const [prevData, setPrevData] = React.useState({
        name: '',
        description: '',
        price: ''
    });
    let change = [];

    React.useEffect(() => {
        loadData();
    }, [param.id])

    const loadData = async () => {
        if (param.id) {
            const res = await getSpecificTreatment(param.id);
            reset({
                name: res.data.name,
                description: res.data.description,
                price: res.data.price
            });
            setPrevData({
                ...prevData,
                name: res.data.name,
                description: res.data.description,
                price: res.data.price
            });
        }
    }

    const onSubmit = async (data) => {
        try {
            if (param.id) {
                for (const key in prevData) {
                    if (prevData[key] !== data[key]) {
                        if (key === 'name') {
                            change.push("nombre del tratamiento");
                        }
                        else if (key === 'description') {
                            change.push("descripción");
                        }
                        else if (key === 'price') {
                            change.push("precio");
                        }
                    }
                }
                if (change.length > 0) {
                    await putTreatment(param.id, data);
                    await sweetAlert('¿Estás seguro?', `¿Deseas modificar ${change.join(', ')}?`, 'warning', 'success', 'Actualizado');
                }
                else {
                    sweetToast('warning', 'No se realizaron modificaciones');
                }
            }
            else {
                await postTreatment(data);
                sweetToast("success", `Se agregó ${data.name} a la lista de tratamientos`);
            }
            loadTreatments();
            reset({
                name: '',
                description: '',
                price: ''
            });
            onOpenChange(false);
            modifyURL();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={() => {
                onOpenChange(true);
                reset({
                    name: '',
                    description: '',
                    price: ''
                });
                modifyURL();
            }}
            radius="sm"
            backdrop="blur"
            isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader className="flex flex-col gap-1">{param.id ? 'Modificar Tratamiento' : 'Nuevo Tratamiento'}</ModalHeader>
                            <ModalBody>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Nombre"
                                            variant="underlined"
                                            autoFocus
                                            isInvalid={errors.name ? true : false}
                                        />
                                    )}
                                />
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Descripción"
                                            variant="underlined"
                                            isInvalid={errors.description ? true : false}
                                        />
                                    )}
                                />
                                <Controller
                                    name="price"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="0.00"
                                            errorMessage={" "}
                                            label="Precio"
                                            variant="underlined"
                                            startContent={'C$'}
                                            isInvalid={errors.price ? true : false}
                                        />
                                    )}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" radius="sm" onPress={() => {
                                    onClose();
                                    reset();
                                    modifyURL();
                                }}>
                                    Cerrar
                                </Button>
                                <Button color="primary" radius="sm" type="submit">
                                    Guardar
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}