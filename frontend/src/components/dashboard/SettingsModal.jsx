import React from "react";
import { useForm, Controller } from "react-hook-form"
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { getSpecificOdontogramToothCondition, getSpecificTreatment, postOdontogramToothCondition, postTreatment, putOdontogramToothCondition, putTreatment } from "../../api/apiFunctions";
import { sweetAlert, sweetToast } from "./Alerts";

export default function SettingsModal({ isOpen, onOpenChange, loadTreatments, param, modifyURL, displayValues }) {
    const { control, handleSubmit, formState: { errors }, reset, watch } = useForm(
        displayValues === 'T' ?
            {
                defaultValues: {
                    name: '',
                    description: '',
                    price: ''
                }
            } :
            {
                defaultValues: {
                    condition_name: '',
                    color: ''
                }
            }
    );
    const [prevData, setPrevData] = React.useState(
        displayValues === 'T' ?
            {
                name: '',
                description: '',
                price: ''
            } :
            {
                condition_name: '',
                color: ''
            }

    );
    let change = [];

    React.useEffect(() => {
        loadData();
    }, [param.id])

    const loadData = async () => {
        if (param.id) {
            if (displayValues === 'T') {
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
            else {
                const res = await getSpecificOdontogramToothCondition(param.id);
                reset({
                    condition_name: res.data.condition_name,
                    color: res.data.color,
                });
                setPrevData({
                    ...prevData,
                    condition_name: res.data.condition_name,
                    color: res.data.color,
                });
            }
        }
    }

    const onSubmit = async (data) => {
        try {
            if (param.id) {
                if (displayValues === 'T') {
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
                }
                else {
                    for (const key in prevData) {
                        if (prevData[key] !== data[key]) {
                            if (key === 'condition_name') {
                                change.push("nombre de la condición");
                            }
                            else if (key === 'color') {
                                change.push("color");
                            }
                        }
                    }
                }
                if (change.length > 0) {
                    await displayValues === 'T' ? putTreatment(param.id, data) : putOdontogramToothCondition(param.id, data);
                    await sweetAlert('¿Estás seguro?', `¿Deseas modificar ${change.join(', ')}?`, 'warning', 'success', 'Actualizado');
                }
                else {
                    sweetToast('warning', 'No se realizaron modificaciones');
                }
            }
            else {
                await displayValues === 'T' ? postTreatment(data) : postOdontogramToothCondition(data);
                sweetToast("success", `Se agregó ${displayValues === 'T' ? data.name : data.condition_name} a la lista de ${displayValues === 'T' ? 'tratamientos' : 'condiciones dentales'}`);
            }
            loadTreatments();
            resetAll();
            onOpenChange(false);
            modifyURL();
        } catch (error) {
            console.log(error);
        }
    }

    const resetAll = () => {
        reset(
            displayValues === 'T' ?
                {
                    name: '',
                    description: '',
                    price: ''
                } :
                {
                    condition_name: '',
                    color: ''
                }
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={() => {
                onOpenChange(true);
                resetAll();
                modifyURL();
            }}
            radius="sm"
            backdrop="blur"
            isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader className="flex flex-col gap-1">{param.id ? (displayValues === 'T' ? 'Modificar Tratamiento' : 'Modificar Condición Dental') : (displayValues === 'T' ? 'Nuevo Tratamiento' : 'Nueva Condición Dental')}</ModalHeader>
                            <ModalBody>
                                <Controller
                                    name={displayValues === 'T' ? "name" : "condition_name"}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label={displayValues === 'T' ? "Nombre" : "Nombre de la condición"}
                                            variant="underlined"
                                            autoFocus
                                            isInvalid={displayValues === 'T' ? (errors.name ? true : false) : (errors.condition_name ? true : false)}
                                        />
                                    )}
                                />
                                <Controller
                                    name={displayValues === 'T' ? "description" : "color"}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label={displayValues === 'T' ? "Descripción" : "Color"}
                                            variant="underlined"
                                            isInvalid={displayValues === 'T' ? (errors.description ? true : false) : (errors.color ? true : false)}
                                        />
                                    )}
                                />
                                {displayValues === 'T' &&
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
                                }
                                {displayValues === 'OD' &&
                                    <svg width="100%" height="20" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="100%" height="5" x="0" y="5" rx="1" ry="1" fill={watch('color') !== '' ? watch('color') : 'white'} />
                                    </svg>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" radius="sm" onClick={onClose}>
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