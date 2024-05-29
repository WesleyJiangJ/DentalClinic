import React from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Textarea } from "@nextui-org/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { getAllPatients, getAllPersonal, getAllTreatment, getSpecificBudget, postBudget, postPayment, putBudget } from "../../api/apiFunctions";
import { sweetToast, sweetAlert } from "./Alerts";

export default function BudgetModal({ isOpen, onOpenChange, param, updateTable, modifyURL }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [patientData, setPatientData] = React.useState([]);
    const [patientName, setPatientName] = React.useState('');
    const [personalData, setPersonalData] = React.useState([]);
    const [treatmentData, setTreatmentData] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const { control, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm({
        defaultValues: {
            id_patient: '',
            name: '',
            description: '',
            total: 0,
            status: true,
            detailFields: [{
                id_treatment: '',
                cost: '',
                quantity: '',
                total: '',
                id_personal: ''
            }]
        }
    });
    const { fields, append, remove, } = useFieldArray({
        control,
        name: 'detailFields'
    });

    React.useEffect(() => {
        loadData();
    }, [param.id])

    const onSubmit = async (data) => {
        try {
            if (param.id) {
                await putBudget(param.id, data);
                sweetToast('success', `${data.name.charAt(0).toUpperCase() + data.name.slice(1)} fue modificado`);
            }
            else {
                await postBudget(data);
                sweetToast('success', `${data.name.charAt(0).toUpperCase() + data.name.slice(1)} fue agregado a presupuestos`);
            }
            updateTable();
            restore();
        } catch (error) {
            console.log(error);
        }
    };

    const loadData = async () => {
        const [patients, personals, treatments, budgetData] = await Promise.all([
            !param.id ? getAllPatients() : null,
            getAllPersonal(),
            getAllTreatment(),
            param.id ? getSpecificBudget(param.id) : null,
        ]);

        { !param.id && setPatientData(patients.data.filter(patient => patient.status === true)) };
        setPersonalData(personals.data.filter(personal => personal.status === true && personal.role === 2));
        setTreatmentData(treatments.data);

        if (param.id && budgetData) {
            reset({ ...budgetData.data });
            setPatientName(budgetData.data.patient_data.first_name + ' ' + budgetData.data.patient_data.middle_name + ' ' + budgetData.data.patient_data.first_lastname + ' ' + budgetData.data.patient_data.second_lastname);
            let totalCost = 0;
            for (const key in getValues().detailFields) {
                handleTreatmentAPI(key, getValues().detailFields[key].id_treatment);
                totalCost += getValues().detailFields[key].cost * getValues().detailFields[key].quantity;
            }
            setValue('total', totalCost);
            setTotal(totalCost);
        }
    }

    const handleTreatmentAPI = (index, value) => {
        const selectedTreatment = treatmentData.find(treatment => treatment.id === parseInt(value));
        if (selectedTreatment !== undefined) {
            setValue(`detailFields[${index}].cost`, selectedTreatment.price);
            setValue(`detailFields[${index}].total`, parseFloat(getValues().detailFields[index].cost) * parseInt(getValues().detailFields[index].quantity));
        }
    };

    const handleTreatmentChange = (index, value) => {
        const selectedTreatment = treatmentData.find(treatment => treatment.id === parseInt(value));

        if (selectedTreatment) {
            setValue(`detailFields[${index}].cost`, selectedTreatment.price);
        }
        else {
            setValue(`detailFields[${index}].cost`, '');
        }
        setValue(`detailFields[${index}].quantity`, '');
        setValue(`detailFields[${index}].total`, '');
        setValue(`detailFields[${index}].id_personal`, '');
        setTotal(calculateGrandTotal());
    };

    const handleTotalChange = (index, value) => {
        const cost = getValues(`detailFields[${index}].cost`);
        if (String(value).trim() !== '') {
            setValue(`detailFields[${index}].total`, cost * value);
            setTotal(calculateGrandTotal());
        }
        else {
            setValue(`detailFields[${index}].total`, '');
        }
    }

    // Function to calculate the total of all totals in detailFields
    const calculateGrandTotal = () => {
        let totalGeneral = 0;
        fields.forEach((_, index) => {
            const totalCampo = parseFloat(getValues(`detailFields[${index}].total`));
            if (!isNaN(totalCampo)) {
                totalGeneral += totalCampo;
            }
        });
        setValue('total', totalGeneral);
        return totalGeneral;
    };

    const cancelBudget = async () => {
        await sweetAlert("¿Deseas eliminar el presupuesto?", "", "warning", "success", "El presupuesto fue eliminado");
        const defaultValues = getValues();
        defaultValues.status = false;
        await putBudget(param.id, defaultValues)
            .then(() => {
                updateTable();
                restore();
            })
            .catch((error) => {
                console.error('Error: ', error);
            })
    }

    const createPaymentControl = async () => {
        await sweetAlert("¿Deseas crear el control de pago?", "Al continuar, no podrás realizar cambios", "warning", "success", "El control de pagos ha sido creado");
        const data = {
            id_budget: param.id,
        }
        const defaultValues = getValues();
        defaultValues.status = false;
        await postPayment(data)
            .then(async () => {
                await putBudget(param.id, defaultValues)
                    .then(() => {
                        updateTable();
                        restore();
                    })
                    .catch((error) => {
                        console.error('Error: ', error);
                    })
                navigate('/dashboard/payment');
            })
            .catch((error) => {
                console.error('Error: ', error);
            })
    }

    const restore = () => {
        modifyURL();
        clearAll();
        onOpenChange(true);
        setTotal(0);
    }

    const clearAll = () => {
        reset({
            id_patient: '',
            name: '',
            description: '',
            status: true,
            detailFields: Array.from({ length: fields.length }).map(() => ({
                id_treatment: '',
                cost: '',
                quantity: '',
                total: '',
                id_personal: ''
            })),
        });
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={() => {
                    restore();
                }}
                size="full"
                radius="sm"
                isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <ModalHeader className="flex flex-col gap-1">{param.id ? "Editar" : "Nuevo"} Presupuesto</ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-5">
                                        <div className="flex flex-col gap-4">
                                            {!param.id ?
                                                <Controller
                                                    name="id_patient"
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            label="Paciente"
                                                            variant="underlined"
                                                            disallowEmptySelection
                                                            isInvalid={errors.id_patient ? true : false}>
                                                            {patientData.map((patient) => (
                                                                <SelectItem key={patient.id} value={patient.id} textValue={patient.first_name + ' ' + patient.middle_name + ' ' + patient.first_lastname + ' ' + patient.second_lastname}>
                                                                    {patient.first_name} {patient.middle_name} {patient.first_lastname} {patient.second_lastname}
                                                                </SelectItem>
                                                            ))}
                                                        </Select>
                                                    )}
                                                />
                                                :
                                                <Input
                                                    variant="underlined"
                                                    value={patientName}
                                                    readOnly
                                                />
                                            }

                                            <Controller
                                                name="name"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label="Nombre del Presupuesto"
                                                        variant="underlined"
                                                        isInvalid={errors.name ? true : false}
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name="description"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Textarea
                                                        {...field}
                                                        label="Descripción"
                                                        variant="underlined"
                                                        minRows={2}
                                                        maxRows={4}
                                                        isInvalid={errors.description ? true : false}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <Table
                                            aria-label="Add Budget Table"
                                            radius="sm"
                                            shadow="none"
                                            className="h-[35vh]">
                                            <TableHeader>
                                                <TableColumn>Tratamiento</TableColumn>
                                                <TableColumn>Precio</TableColumn>
                                                <TableColumn>Cantidad</TableColumn>
                                                <TableColumn>Total</TableColumn>
                                                <TableColumn>Médico</TableColumn>
                                                <TableColumn></TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {fields.map((field, index) => (
                                                    <TableRow key={field.id}>
                                                        <TableCell className="w-1/4">
                                                            <Controller
                                                                name={`detailFields[${index}].id_treatment`}
                                                                control={control}
                                                                rules={{ required: true }}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        label="Tratamiento"
                                                                        variant="underlined"
                                                                        disallowEmptySelection
                                                                        defaultSelectedKeys={String(field.value)}
                                                                        onChange={(e) => {
                                                                            field.onChange(e);
                                                                            handleTreatmentChange(index, e.target.value);
                                                                        }}
                                                                        isInvalid={errors?.detailFields?.[index]?.id_treatment ? true : false}>
                                                                        {treatmentData.map((treatment) => (
                                                                            <SelectItem key={treatment.id} value={treatment.id} textValue={treatment.name}>
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-small">{treatment.name}</span>
                                                                                    <span className="text-tiny text-default-400">{treatment.description}</span>
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </Select>
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Controller
                                                                name={`detailFields[${index}].cost`}
                                                                control={control}
                                                                rules={{ required: true }}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        label={'Precio'}
                                                                        placeholder="0.00"
                                                                        variant="underlined"
                                                                        startContent={'C$'}
                                                                        isReadOnly
                                                                    />
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Controller
                                                                name={`detailFields[${index}].quantity`}
                                                                control={control}
                                                                rules={{ required: true }}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        label={'Cantidad'}
                                                                        variant="underlined"
                                                                        type="number"
                                                                        min={1}
                                                                        errorMessage={" "}
                                                                        isInvalid={errors?.detailFields?.[index]?.quantity ? true : false}
                                                                        onChange={(e) => {
                                                                            field.onChange(e);
                                                                            handleTotalChange(index, e.target.value);
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Controller
                                                                name={`detailFields[${index}].total`}
                                                                control={control}
                                                                defaultValue={''}
                                                                rules={{ required: true }}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        label={'Total'}
                                                                        placeholder="0.00"
                                                                        variant="underlined"
                                                                        startContent={'C$'}
                                                                        isReadOnly
                                                                    />
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="w-1/4">
                                                            <Controller
                                                                name={`detailFields[${index}].id_personal`}
                                                                control={control}
                                                                rules={{ required: true }}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        label="Médico"
                                                                        variant="underlined"
                                                                        key={`${field.name}-${field.value}`}
                                                                        disallowEmptySelection
                                                                        defaultSelectedKeys={String(field.value)}
                                                                        isInvalid={errors?.detailFields?.[index]?.id_personal ? true : false}>
                                                                        {personalData.map((personal) => (
                                                                            <SelectItem key={personal.id} value={personal.id} textValue={personal.first_name + ' ' + personal.middle_name + ' ' + personal.first_lastname + ' ' + personal.second_lastname}>
                                                                                {personal.first_name} {personal.middle_name} {personal.first_lastname} {personal.second_lastname}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </Select>
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                color="danger"
                                                                radius="sm"
                                                                variant="light"
                                                                size="lg"
                                                                isIconOnly
                                                                className="w-full"
                                                                onClick={() => {
                                                                    remove(index);
                                                                    setTotal(calculateGrandTotal());
                                                                }}>
                                                                <TrashIcon className="w-5 h-5" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <Input
                                            label={"Total"}
                                            size="lg"
                                            radius="sm"
                                            isReadOnly
                                            value={total.toLocaleString()}
                                            startContent={'C$'}
                                        />
                                        <Button
                                            className="w-full my-2"
                                            color="primary"
                                            radius="sm"
                                            size="lg"
                                            onClick={() => append({ id_treatment: '', cost: '', quantity: '', total: '', id_personal: '' })}>
                                            Agregar Campo
                                        </Button>
                                    </div>
                                </ModalBody>
                                <ModalFooter className={param.id ? "flex justify-between" : ""}>
                                    {param.id ?
                                        <div className="flex flex-row gap-2">
                                            <Button color="danger" radius="sm" variant="solid" onClick={cancelBudget}>
                                                Eliminar
                                            </Button>
                                            <Button color="primary" radius="sm" variant="solid" onClick={createPaymentControl}>
                                                Crear Control de Pagos
                                            </Button>
                                        </div>
                                        :
                                        ""
                                    }
                                    <div className="flex gap-2">
                                        <Button color="danger" variant="light" radius="sm" onPress={onClose}>
                                            Cerrar
                                        </Button>
                                        <Button color="primary" radius="sm" type="submit">
                                            {param.id ? 'Actualizar' : 'Guardar'}
                                        </Button>
                                    </div>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}