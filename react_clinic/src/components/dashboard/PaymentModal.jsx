import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider, Textarea } from "@nextui-org/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { getAllPatients, getAllPersonal, getAllTreatment } from "../../api/apiFunctions";

export default function PaymentModal({ isOpen, onOpenChange }) {
    const [patientData, setPatientData] = React.useState([]);
    const [personalData, setPersonalData] = React.useState([]);
    const [treatmentData, setTreatmentData] = React.useState([]);
    const { control, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm({
        defaultValues: {
            id_patient: '',
            name: '',
            description: '',
            status: 1,
            detailFields: [{ id_budget: '', id_treatment: '', cost: '', quantity: '', total: '', id_personal: '' }]
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'detailFields',
    });
    const [total, setTotal] = React.useState(0);

    React.useEffect(() => {
        loadData();
    }, [])

    const onSubmit = (data) => {
        console.log(data);
    };

    const loadData = async () => {
        setPatientData((await getAllPatients()).data.filter(patient => patient.status === true));
        setPersonalData((await getAllPersonal()).data.filter(personal => personal.status === true && personal.role === 2));
        setTreatmentData((await getAllTreatment()).data);
    }

    const handleTreatmentChange = (index, value) => {
        const selectedTreatment = treatmentData.find(treatment => treatment.id === parseInt(value));

        if (selectedTreatment) {
            setValue(`detailFields[${index}].cost`, selectedTreatment.price);
            setValue(`detailFields[${index}].quantity`, '');
            setValue(`detailFields[${index}].total`, '');
            setTotal(calculateGrandTotal());
        }
        else {
            setValue(`detailFields[${index}].cost`, '');
            setValue(`detailFields[${index}].quantity`, '');
            setValue(`detailFields[${index}].total`, '');
            setTotal(calculateGrandTotal());
        }
    };

    const handleTotalChange = (index, value) => {
        const cost = getValues(`detailFields[${index}].cost`);
        if (value.trim() !== '') {
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
        fields.forEach((field, index) => {
            const totalCampo = parseFloat(getValues(`detailFields[${index}].total`));
            if (!isNaN(totalCampo)) {
                totalGeneral += totalCampo;
            }
        });
        console.log(totalGeneral)
        return totalGeneral;
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={() => {
                    onOpenChange(true);
                    reset();
                    setTotal(0);
                }}
                size="full"
                radius="sm"
                isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <ModalHeader className="flex flex-col gap-1">Nuevo Presupuesto</ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-5">
                                        <div className="flex flex-col gap-4">
                                            <Controller
                                                name="id_patient"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        label="Paciente"
                                                        variant="underlined"
                                                        isInvalid={errors.id_patient ? true : false}>
                                                        {patientData.map((patient) => (
                                                            <SelectItem key={patient.id} value={patient.id} textValue={patient.first_name + ' ' + patient.middle_name + ' ' + patient.first_lastname + ' ' + patient.second_lastname}>
                                                                {patient.first_name} {patient.middle_name} {patient.first_lastname} {patient.second_lastname}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />

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
                                                                defaultValue=""
                                                                rules={{ required: true }}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        label={'Precio'}
                                                                        placeholder="0.00"
                                                                        variant="underlined"
                                                                        startContent={'C$'}
                                                                        isReadOnly
                                                                        isInvalid={errors?.detailFields?.[index]?.cost ? true : false}
                                                                    />
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Controller
                                                                name={`detailFields[${index}].quantity`}
                                                                control={control}
                                                                defaultValue=""
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
                                                                defaultValue=""
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
                                                                        label="Médico"
                                                                        variant="underlined"
                                                                        isInvalid={errors?.detailFields?.[index]?.id_personal ? true : false}
                                                                        {...field}>
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
                                            onClick={() => append({ id_budget: '', id_treatment: '', cost: '', quantity: '', id_personal: '' })}>
                                            Agregar Campo
                                        </Button>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" radius="sm" onPress={onClose}>
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
        </>
    )
}