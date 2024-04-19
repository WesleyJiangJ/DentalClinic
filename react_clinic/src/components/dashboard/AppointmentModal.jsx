import React from "react";
import { sweetAlert, sweetToast } from "./Alerts";
import { useForm, Controller } from "react-hook-form"
import { getAllPatients, getAllPersonal, getSpecificAppointment, postAppointment, putAppointment } from "../../api/apiFunctions";
import { Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, DatePicker } from "@nextui-org/react";
import { now, getLocalTimeZone, parseDateTime, today } from "@internationalized/date";

export default function AppointmentModal({ isOpen, onOpenChange, reloadData, param, modifyURL }) {
    const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm({
        defaultValues: {
            id_patient: '',
            patient_name: '',
            id_personal: '',
            personal_name: '',
            personal_gender: '',
            datetime: now(getLocalTimeZone()),
            reason: '',
            observation: '',
            cancellation_reason: '',
            status: 1,
        }
    });
    const [patientData, setPatientData] = React.useState([]);
    const [personalData, setPersonalData] = React.useState([]);
    const [cancellation, setCancellation] = React.useState(false);
    const readOnly = param.slug === 'check';
    const [prevData, setPrevData] = React.useState({
        reason: '',
        datetime: ''
    });
    let change = [];

    React.useEffect(() => {
        loadData();
    }, [param.id]);

    const loadData = async () => {
        if (param.id) {
            const res = await getSpecificAppointment(param.id);
            reset({
                id_patient: res.data.id_patient,
                patient_name: res.data['patient_data'].first_name + ' ' + res.data['patient_data'].middle_name + ' ' + res.data['patient_data'].first_lastname + ' ' + res.data['patient_data'].second_lastname,
                id_personal: res.data.id_personal,
                personal_name: res.data['personal_data'].first_name + ' ' + res.data['personal_data'].middle_name + ' ' + res.data['personal_data'].first_lastname + ' ' + res.data['personal_data'].second_lastname,
                personal_gender: res.data['personal_data'].gender,
                datetime: parseDateTime((res.data.datetime).slice(0, -1)),
                reason: res.data.reason,
                observation: res.data.observation,
                cancellation_reason: '',
                status: res.data.status,
            });
            setPrevData({
                ...prevData,
                datetime: parseDateTime((res.data.datetime).slice(0, -1)),
                reason: res.data.reason
            });
        }
        else {
            setPatientData((await getAllPatients()).data);
            setPersonalData((await getAllPersonal()).data.filter(personal => personal.role === 2));
        }
    }

    const onSubmit = async (data) => {
        try {
            const date = data.datetime.year + '-' + String(data.datetime.month).padStart(2, '0') + '-' + String(data.datetime.day).padStart(2, '0') + 'T' + String(data.datetime.hour).padStart(2, '0') + ':' + String(data.datetime.minute).padStart(2, '0') + ':00Z';
            if (param.id) {
                let dateArray = [];
                let changeUnique = [];
                const parse_date = parseDateTime((date).slice(0, -1));
                const form_date = parse_date.year + '-' + String(parse_date.month).padStart(2, '0') + '-' + String(parse_date.day).padStart(2, '0');
                const form_time = String(parse_date.hour).padStart(2, '0') + ':' + String(parse_date.minute).padStart(2, '0');
                const form_prev_date = prevData['datetime'].year + '-' + String(prevData['datetime'].month).padStart(2, '0') + '-' + String(prevData['datetime'].day).padStart(2, '0');
                const form_prev_time = String(prevData['datetime'].hour).padStart(2, '0') + ':' + String(prevData['datetime'].minute).padStart(2, '0');

                for (const key in prevData) {
                    dateArray.push(form_date, form_time);
                    dateArray.push(form_prev_date, form_prev_time);

                    if (prevData[key] !== data[key]) {
                        if (key === "reason") {
                            change.push("motivo");
                        }
                        else if (key === "datetime") {
                            if (dateArray[0] !== dateArray[2] && dateArray[1] !== dateArray[3]) {
                                change.push("fecha y hora");
                            }
                            else {
                                if (dateArray[0] !== dateArray[2]) {
                                    change.push("fecha");
                                }
                                if (dateArray[1] !== dateArray[3]) {
                                    change.push("hora");
                                }
                            }
                        }
                    }
                }
                changeUnique = [...new Set(change)];
                if (change.length > 0 || param.slug === "check") {
                    await sweetAlert('¿Estás seguro?', (param.slug === "edit" ? `¿Deseas modificar ${changeUnique.join(', ')}?` : '¿Desea marcarla como realizada?'), 'warning', 'success', (param.slug === 'edit' ? 'Actualizado' : "Cita realizada"));
                    if (param.slug === 'check') {
                        data.datetime = date;
                        data.status = 3;
                        await putAppointment(param.id, data);
                    }
                    else {
                        data.datetime = date;
                        await putAppointment(param.id, data);
                    }
                }
                else {
                    sweetToast('warning', 'No se realizaron modificaciones')
                }
            }
            else {
                data.datetime = date;
                await postAppointment(data);
                sweetToast('success', `Se ha agregado ${data.reason}`);
            }
            reloadData();
            resetForm();
            onOpenChange(false);
        } catch (error) {
            console.log(error);
        }
    }

    const resetForm = () => {
        reset({
            id_patient: '',
            patient_name: '',
            id_personal: '',
            personal_name: '',
            personal_gender: '',
            datetime: now(getLocalTimeZone()),
            reason: '',
            observation: '',
            cancellation_reason: '',
            status: 1,
        });
        setCancellation(false);
        if (param.id) {
            modifyURL();
        }
    }

    const cancelAppointment = async () => {
        setCancellation(true);
        if (getValues('cancellation_reason').length > 0) {
            await sweetAlert("¿Deseas cancelar la cita?", "", "warning", "success", "La cita fue cancelada");
            const defaultValues = getValues();
            defaultValues.status = 2;
            const date = defaultValues.datetime.year + '-' + String(defaultValues.datetime.month).padStart(2, '0') + '-' + String(defaultValues.datetime.day).padStart(2, '0') + 'T' + String(defaultValues.datetime.hour).padStart(2, '0') + ':' + String(defaultValues.datetime.minute).padStart(2, '0') + ':00Z';
            defaultValues.datetime = date;
            defaultValues.observation = defaultValues.cancellation_reason;
            await putAppointment(param.id, defaultValues)
                .then(() => {
                    reloadData();
                })
                .catch((error) => {
                    console.error('Error: ', error);
                })
            resetForm();
            onOpenChange(false);
        }
    }

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
                backdrop="blur"
                isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <ModalHeader className="flex flex-col gap-1">
                                    {param.id
                                        ?
                                        param.slug === "edit" ? "Modificar Cita" : `Marcar ${getValues('reason').toLowerCase()} como realizada`
                                        :
                                        "Nueva Cita"
                                    }
                                </ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-5">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {param.id
                                                ?
                                                <Controller
                                                    name="patient_name"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            readOnly
                                                            variant="underlined"
                                                        />
                                                    )}
                                                />
                                                :
                                                <Controller
                                                    name="id_patient"
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <Select
                                                            label="Paciente"
                                                            variant="underlined"
                                                            isInvalid={errors.id_patient ? true : false}
                                                            {...field}>
                                                            {patientData.map((patient) => (
                                                                <SelectItem key={patient.id} value={patient.id} textValue={patient.first_name + ' ' + patient.middle_name + ' ' + patient.first_lastname + ' ' + patient.second_lastname}>
                                                                    {patient.first_name} {patient.middle_name} {patient.first_lastname} {patient.second_lastname}
                                                                </SelectItem>
                                                            ))}
                                                        </Select>
                                                    )}
                                                />
                                            }
                                            {param.id
                                                ?
                                                <Controller
                                                    name="personal_name"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            readOnly
                                                            variant="underlined"
                                                            startContent={getValues('personal_gender') === "F" ? "Dra. " : "Dr. "}
                                                        />
                                                    )}
                                                />
                                                :
                                                <Controller
                                                    name="id_personal"
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <Select
                                                            label="Personal"
                                                            variant="underlined"
                                                            isInvalid={errors.id_personal ? true : false}
                                                            {...field}>
                                                            {personalData
                                                                .map((personal) => (
                                                                    <SelectItem key={personal.id} value={personal.id} textValue={personal.first_name + ' ' + personal.middle_name + ' ' + personal.first_lastname + ' ' + personal.second_lastname}>
                                                                        {personal.first_name} {personal.middle_name} {personal.first_lastname} {personal.second_lastname}
                                                                    </SelectItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                />
                                            }
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <Controller
                                                name="datetime"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) =>
                                                    <DatePicker
                                                        {...field}
                                                        label="Fecha y hora"
                                                        variant="underlined"
                                                        isReadOnly={readOnly}
                                                        minValue={today(getLocalTimeZone())}
                                                        hourCycle={12}
                                                        hideTimeZone
                                                        isInvalid={errors.datetime ? true : false}
                                                    />
                                                }
                                            />
                                        </div>
                                        <Controller
                                            name={param.slug === "edit" || !param.slug ? 'reason' : 'observation'}
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) =>
                                                <Textarea
                                                    {...field}
                                                    label={param.slug === "edit" || !param.slug ? 'Motivo' : "Observaciones"}
                                                    placeholder="Escriba aquí . . ."
                                                    size="lg"
                                                    radius="sm"
                                                    isInvalid={(!param.slug ? errors.reason : errors.observation) ? true : false}
                                                    readOnly={cancellation ? true : false}
                                                />
                                            }
                                        />
                                        {cancellation === true &&
                                            <Controller
                                                name='cancellation_reason'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) =>
                                                    <Textarea
                                                        {...field}
                                                        label='Motivo de Cancelación'
                                                        placeholder="Escriba aquí . . ."
                                                        size="lg"
                                                        radius="sm"
                                                        isInvalid={getValues('cancellation_reason').length === 0 ? true : false}
                                                    />
                                                }
                                            />
                                        }
                                    </div>
                                </ModalBody>
                                <ModalFooter className={param.id && param.slug === "edit" ? "flex justify-between" : ""}>
                                    {param.id && param.slug === "edit" ?
                                        <Button color="danger" radius="sm" variant="solid" onPress={cancelAppointment}>
                                            {cancellation ? 'Confirmar Cancelación' : 'Cancelar Cita'}
                                        </Button>
                                        :
                                        ""
                                    }
                                    <div>
                                        <Button color="danger" radius="sm" variant="light" onPress={onClose}>
                                            Cerrar
                                        </Button>
                                        {!cancellation &&
                                            <Button className="bg-[#1E1E1E] text-white ml-2" radius="sm" type="submit">
                                                {param.id ? (param.slug === 'edit' ? 'Reprogramar' : 'Realizada') : 'Agendar'}
                                            </Button>
                                        }
                                    </div>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}