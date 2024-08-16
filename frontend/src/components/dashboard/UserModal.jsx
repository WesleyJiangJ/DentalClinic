import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form"
import { sweetToast } from './Alerts'
import { postPatient, putPatient, getSpecificPatient, postPersonal, putPersonal, getSpecificPersonal } from "../../api/apiFunctions";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";

export default function UserModal({ isOpen, onOpenChange, updateTable, updateData, value }) {
    const param = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            first_name: '',
            middle_name: '',
            first_lastname: '',
            second_lastname: '',
            birthdate: '',
            gender: '',
            email: '',
            phone_number: '',
            origin: '',
            address: '',
            marital_status: '',
            occupation: '',
            emergency_contact: '',
            emergency_number: '',
            role: ''
        }
    });
    const genders = [
        { label: "Femenino", value: "F" },
        { label: "Masculino", value: "M" },
    ]
    const nicaraguaCities = [
        { label: "Boaco", value: "BO" },
        { label: "Carazo", value: "CA" },
        { label: "Chinandega", value: "CI" },
        { label: "Chontales", value: "CO" },
        { label: "Estelí", value: "ES" },
        { label: "Granada", value: "GR" },
        { label: "Jinotega", value: "JI" },
        { label: "León", value: "LE" },
        { label: "Madriz", value: "MD" },
        { label: "Managua", value: "MN" },
        { label: "Masaya", value: "MS" },
        { label: "Matagalpa", value: "MT" },
        { label: "Nueva Segovia", value: "NS" },
        { label: "Río San Juan", value: "SJ" },
        { label: "Rivas", value: "RV" },
        { label: "Región Autónoma de la Costa Caribe Norte", value: "AN" },
        { label: "Región Autónoma de la Costa Caribe Sur", value: "AS" },
    ];
    const maritalStatus = [
        { label: "Soltero", value: "S" },
        { label: "Casado", value: "C" },
        { label: "Divorciado", value: "D" },
        { label: "Viudo", value: "V" },
        { label: "Unión Libre", value: "U" },
    ];
    const rol = [
        { label: "Admin", value: "1" },
        { label: "Doctor", value: "2" },
        { label: "Asistente", value: "3" },
        { label: "Paciente", value: "4" },
    ]

    React.useEffect(() => {
        async function loadData() {
            if (param.id) {
                if (value === "Paciente") {
                    const res = (await getSpecificPatient(param.id)).data;
                    reset({ ...res });
                }
                else if (value === "Personal") {
                    const res = (await getSpecificPersonal(param.id)).data;
                    reset({ ...res });
                }
            }
        }
        loadData();
    }, []);

    const onSubmit = async (data) => {
        try {
            if (param.id) {
                try {
                    if (value === "Paciente") {
                        await putPatient(param.id, data);
                    }
                    else if (value === "Personal") {
                        await putPersonal(param.id, data);
                    }
                    updateData();
                    onOpenChange(false);
                    sweetToast("success", "Actualizado");
                } catch (error) {
                    console.log(error);
                }
            }
            else {
                if (value === "Paciente") {
                    await postPatient(data)
                        .then((response) => {
                            navigate(`detail/${response.data.id}`);
                        });
                }
                else {
                    await postPersonal(data)
                        .then((response) => {
                            navigate(`detail/${response.data.id}`);
                        });
                }
                reset();
                updateTable();
                onOpenChange(false);
                sweetToast("success", `Se ha agregado a ${data.first_name} ${data.first_lastname}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={() => {
                    onOpenChange(true);
                    !param.id && reset();
                }}
                placement="top-center"
                size="5xl"
                radius="sm"
                backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader className="flex flex-col gap-1">
                                {param.id ? `Modificar ${value}` : `Agregar ${value}`}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-2 md:flex-row">
                                    <Controller
                                        name="first_name"
                                        control={control}
                                        rules={{
                                            required: true,
                                            validate: value => !value.includes(' ')
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Primer Nombre"
                                                variant="underlined"
                                                isInvalid={errors.first_name ? true : false}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="middle_name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Segundo Nombre"
                                                variant="underlined"
                                                isInvalid={errors.middle_name ? true : false}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row">
                                    <Controller
                                        name="first_lastname"
                                        control={control}
                                        rules={{
                                            required: true,
                                            validate: value => !value.includes(' ')
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Primer Apellido"
                                                variant="underlined"
                                                isInvalid={errors.first_lastname ? true : false}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="second_lastname"
                                        control={control}
                                        rules={{
                                            required: true,
                                            validate: value => !value.includes(' ')
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Segundo Apellido"
                                                variant="underlined"
                                                isInvalid={errors.second_lastname ? true : false}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <Controller
                                        name="birthdate"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Fecha de Nacimiento"
                                                variant="underlined"
                                                isInvalid={errors.birthdate ? true : false}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                items={genders}
                                                label="Género"
                                                variant="underlined"
                                                disallowEmptySelection
                                                defaultSelectedKeys={field.value}
                                                isInvalid={errors.gender ? true : false}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}>
                                                {(data) => <SelectItem key={data.value} value={data.value}>{data.label}</SelectItem>}
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row">
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i }
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Correo"
                                                variant="underlined"
                                                type="email"
                                                isInvalid={errors.email ? true : false}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="phone_number"
                                        control={control}
                                        rules={{
                                            minLength: 8,
                                            maxLength: 8,
                                            pattern: { value: /^\d{8}$/ }
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Celular"
                                                variant="underlined"
                                                maxLength={8}
                                                isInvalid={errors.phone_number ? true : false}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row">
                                    <Controller
                                        name="origin"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                label="Departamento"
                                                variant="underlined"
                                                disallowEmptySelection
                                                defaultSelectedKeys={[field.value]}
                                                isInvalid={errors.origin ? true : false}>
                                                {nicaraguaCities.map((origin) => (
                                                    <SelectItem key={origin.value} value={origin.value}>
                                                        {origin.label}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    <Controller
                                        name="address"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Dirección"
                                                variant="underlined"
                                                isInvalid={errors.address ? true : false}
                                            />
                                        )}
                                    />
                                </div>
                                {value === "Paciente" ?
                                    <>
                                        <div>
                                            <Controller
                                                name="marital_status"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        label="Estado Cívil"
                                                        variant="underlined"
                                                        disallowEmptySelection
                                                        defaultSelectedKeys={field.value}
                                                        isInvalid={errors.marital_status ? true : false}>
                                                        {maritalStatus.map((mStatus) => (
                                                            <SelectItem key={mStatus.value} value={mStatus.value}>
                                                                {mStatus.label}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <Controller
                                                name="occupation"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label="Ocupación"
                                                        variant="underlined"
                                                        isInvalid={errors.occupation ? true : false}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 md:flex-row">
                                            <Controller
                                                name="emergency_contact"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label="Nombre de Contacto de Emergencia"
                                                        variant="underlined"
                                                        isInvalid={errors.emergency_contact ? true : false}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="emergency_number"
                                                control={control}
                                                rules={{
                                                    minLength: 8,
                                                    maxLength: 8,
                                                    pattern: { value: /^\d{8}$/ }
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label="Celular de Emergencia"
                                                        variant="underlined"
                                                        maxLength={8}
                                                        isInvalid={errors.emergency_number ? true : false}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </> :
                                    <>
                                        {!param.id &&
                                            <Controller
                                                name="role"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        label="Role"
                                                        variant="underlined"
                                                        disallowEmptySelection
                                                        defaultSelectedKeys={field.value}
                                                        isInvalid={errors.role ? true : false}>
                                                        {rol.filter((rol) => rol.value === "2" || rol.value === "3")
                                                            .map((rol) => (
                                                                <SelectItem key={rol.value} value={rol.value}>
                                                                    {rol.label}
                                                                </SelectItem>
                                                            ))}
                                                    </Select>
                                                )}
                                            />
                                        }
                                    </>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" radius="sm" onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button color="primary" radius="sm" type="submit">
                                    {param.id ? "Actualizar" : "Guardar"}
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}