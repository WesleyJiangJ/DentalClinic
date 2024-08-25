import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Textarea, Tabs, Tab } from "@nextui-org/react";
import { getAllPaymentControl, getSpecificPayment, postPaymentControl, putPayment } from "../../api/apiFunctions";
import { sweetToast } from "./Alerts";

export default function PaymentModal({ isOpen, onOpenChange, param, updateTable, modifyURL }) {
    const [paymentStatus, setPaymentStatus] = React.useState(true);
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            patientName: '',
            name: '',
            description: '',
            totalDebt: 0,
            totalPaid: 0,
            remaining: 0,
            id_payment: 0,
            paid: '',
            note: '',
            treatmentFields: [{ name: '', cost: '', quantity: '', total: '', doctor: '' }],
            paymentFields: [{ paid: 0, note: '', date: '' }]
        }
    });
    const { fields: treatmentFields } = useFieldArray({
        control,
        name: 'treatmentFields'
    });
    const { fields: paymentFields } = useFieldArray({
        control,
        name: 'paymentFields'
    });

    React.useEffect(() => {
        loadData();
    }, [param.id])

    const onSubmit = async (data) => {
        try {
            const calc = parseFloat(data.totalPaid) + parseFloat(data.paid);
            if (calc > data.totalDebt) {
                sweetToast('error', 'Está pagando un monto mayor a la deuda');
            }
            else {
                if (calc === parseFloat(data.totalDebt)) {
                    await postPaymentControl(data);
                    await putPayment(param.id, { status: false });
                    sweetToast('success', `Se ha finalizado el pago del tratamiento`);
                }
                else {
                    await postPaymentControl(data);
                    sweetToast('success', `Se abonaron C$${data.paid}`);
                }
                loadData();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const loadData = async () => {
        if (param.id) {
            try {
                const res = (await getSpecificPayment(param.id)).data;
                setPaymentStatus(res.status);
                const resPaymentControl = (await getAllPaymentControl()).data
                    .filter(payment => payment.id_payment === parseInt(param.id))
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));                 
                const treatmentData = res.budget_data.detailFields.map(field => ({
                    name: field.treatment_data.name,
                    cost: field.cost,
                    quantity: field.quantity,
                    total: field.cost * field.quantity,
                    doctor: `${field.personal_data.first_name} ${field.personal_data.middle_name} ${field.personal_data.first_lastname} ${field.personal_data.second_lastname}`
                }));
                const paymentData = resPaymentControl.map(field => ({
                    paid: field.paid,
                    note: field.note,
                    date: new Date(field.created_at).toLocaleDateString('es-NI', {
                        year: 'numeric', month: '2-digit', day: '2-digit'
                    })
                }));
                reset({
                    patientName: res.budget_data.patient_data.first_name + ' ' + res.budget_data.patient_data.middle_name + ' ' + res.budget_data.patient_data.first_lastname + ' ' + res.budget_data.patient_data.second_lastname,
                    name: res.budget_data.name,
                    description: res.budget_data.description,
                    totalDebt: res.budget_data.total,
                    totalPaid: paymentData.reduce((acc, field) => acc + parseFloat(field.paid), 0),
                    remaining: res.budget_data.total - paymentData.reduce((acc, field) => acc + parseFloat(field.paid), 0),
                    id_payment: res.id,
                    paid: '',
                    note: '',
                    treatmentFields: treatmentData,
                    paymentFields: paymentData
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    const restore = () => {
        modifyURL();
        onOpenChange(true);
        clearAll();
        updateTable();
    }

    const clearAll = () => {
        reset({
            patientName: '',
            name: '',
            description: '',
            totalDebt: 0,
            totalPaid: 0,
            remaining: 0,
            id_payment: 0,
            paid: '',
            note: '',
            treatmentFields: [{ name: '', cost: '', quantity: '', total: '', doctor: '' }],
            paymentFields: [{ paid: 0, note: '', date: '' }]
        })
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
                                <ModalHeader className="flex flex-col gap-1">{paymentStatus ? 'Agregar Cuota' : 'Detalles'}</ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-5">
                                        <div className="flex flex-col gap-4">
                                            <Controller
                                                name="patientName"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label="Nombre del Paciente"
                                                        variant="underlined"
                                                        readOnly
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="name"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label="Nombre"
                                                        variant="underlined"
                                                        readOnly
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="description"
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea
                                                        {...field}
                                                        label="Descripción"
                                                        variant="underlined"
                                                        readOnly
                                                        minRows={2}
                                                        maxRows={4}
                                                    />
                                                )}
                                            />
                                            <div className="flex flex-row gap-2">
                                                <Controller
                                                    name="totalDebt"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            label="Total"
                                                            variant="underlined"
                                                            startContent={"C$"}
                                                            readOnly
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name="totalPaid"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            label="Total Abonado"
                                                            variant="underlined"
                                                            startContent={"C$"}
                                                            readOnly
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name="remaining"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            label="Restante"
                                                            variant="underlined"
                                                            startContent={"C$"}
                                                            readOnly
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Tabs color="primary" size="md" fullWidth>
                                        <Tab key="1" aria-label="Payment Control" title="Control de Pagos">
                                            <div className={`${paymentStatus ? "flex flex-row gap-2" : "hidden"}`}>
                                                <Controller
                                                    name="paid"
                                                    control={control}
                                                    rules={{
                                                        required: true,
                                                        pattern: {
                                                            value: /^\d*\.?\d+$/
                                                        }
                                                    }}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            label="Cuota"
                                                            variant="underlined"
                                                            placeholder="0.00"
                                                            startContent={'C$'}
                                                            value={field.value}
                                                            maxLength={10}
                                                            isInvalid={errors.paid ? true : false}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name="note"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            label="Nota"
                                                            variant="underlined"
                                                            isInvalid={errors.note ? true : false}
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <span className="text-default-500 text-small">{paymentFields.length} abonos</span>
                                            <Table
                                                aria-label="Treatment Detail Table"
                                                radius="sm"
                                                shadow="none"
                                                className="h-[32vh]">
                                                <TableHeader>
                                                    <TableColumn>Cuota</TableColumn>
                                                    <TableColumn>Nota</TableColumn>
                                                    <TableColumn>Fecha</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    {paymentFields.map((field, index) => (
                                                        <TableRow key={field.id}>
                                                            <TableCell>
                                                                <Controller
                                                                    name={`paymentFields[${index}].paid`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Input
                                                                            {...field}
                                                                            label="Pagado"
                                                                            variant="underlined"
                                                                            placeholder="0.00"
                                                                            startContent={'C$'}
                                                                            readOnly
                                                                        />
                                                                    )}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Controller
                                                                    name={`paymentFields[${index}].note`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Input
                                                                            {...field}
                                                                            label={'Nota'}
                                                                            variant="underlined"
                                                                            isReadOnly
                                                                        />
                                                                    )}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Controller
                                                                    name={`paymentFields[${index}].date`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Input
                                                                            {...field}
                                                                            label={'Fecha'}
                                                                            variant="underlined"
                                                                            isReadOnly
                                                                        />
                                                                    )}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Tab>
                                        <Tab key="2" aria-label="Treatment Detail" title="Detalle del Tratamiento">
                                            <Table
                                                aria-label="Treatment Detail Table"
                                                radius="sm"
                                                shadow="none"
                                                className="h-[40vh]">
                                                <TableHeader>
                                                    <TableColumn>Tratamiento</TableColumn>
                                                    <TableColumn>Precio</TableColumn>
                                                    <TableColumn>Cantidad</TableColumn>
                                                    <TableColumn>Total</TableColumn>
                                                    <TableColumn>Médico</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    {treatmentFields.map((field, index) => (
                                                        <TableRow key={field.id}>
                                                            <TableCell className="w-1/4">
                                                                <Controller
                                                                    name={`treatmentFields[${index}].name`}
                                                                    control={control}
                                                                    rules={{ required: true }}
                                                                    render={({ field }) => (
                                                                        <Input
                                                                            {...field}
                                                                            label="Tratamiento"
                                                                            variant="underlined"
                                                                            readOnly
                                                                        />
                                                                    )}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Controller
                                                                    name={`treatmentFields[${index}].cost`}
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
                                                                    name={`treatmentFields[${index}].quantity`}
                                                                    control={control}
                                                                    rules={{ required: true }}
                                                                    render={({ field }) => (
                                                                        <Input
                                                                            {...field}
                                                                            label={'Cantidad'}
                                                                            variant="underlined"
                                                                            isReadOnly
                                                                        />
                                                                    )}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Controller
                                                                    name={`treatmentFields[${index}].total`}
                                                                    control={control}
                                                                    rules={{ required: true }}
                                                                    render={({ field }) => (
                                                                        <Input
                                                                            {...field}
                                                                            label={'Total'}
                                                                            variant="underlined"
                                                                            startContent={'C$'}
                                                                            isReadOnly
                                                                        />
                                                                    )}
                                                                />
                                                            </TableCell>
                                                            <TableCell className="w-1/4">
                                                                <Controller
                                                                    name={`treatmentFields[${index}].doctor`}
                                                                    control={control}
                                                                    rules={{ required: true }}
                                                                    render={({ field }) => (
                                                                        <Input
                                                                            {...field}
                                                                            label={'Médico'}
                                                                            variant="underlined"
                                                                            isReadOnly
                                                                        />
                                                                    )}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Tab>
                                    </Tabs>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" radius="sm" onPress={onClose}>
                                        Cerrar
                                    </Button>
                                    <Button color="primary" radius="sm" className={!paymentStatus && "hidden"} type="submit">
                                        Agregar
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