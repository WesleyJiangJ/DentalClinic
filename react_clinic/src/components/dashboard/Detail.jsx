import React from "react";
import { sweetAlert } from './Alerts'
import { getSpecificPatient, putPatient, getSpecificPersonal, putPersonal, getAllAppointmentsByPatient } from "../../api/apiFunctions";
import { useParams } from 'react-router-dom';
import { Avatar, Button, Divider, Tabs, Tab, Card, CardBody, Textarea, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDisclosure } from "@nextui-org/react";
import { Typography } from "@material-tailwind/react";
import { CheckCircleIcon, ChevronDownIcon, MinusCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid"
import UserModal from "./UserModal"
import AppointmentCard from "./AppointmentCard";

export default function Detail({ value }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [user, setUser] = React.useState([])
    const [appoitmentsPending, setAppoitmentsPending] = React.useState([])
    const { id } = useParams();
    const departamentosNicaragua = {
        BO: "Boaco",
        CA: "Carazo",
        CI: "Chinandega",
        CO: "Chontales",
        ES: "Estelí",
        GR: "Granada",
        JI: "Jinotega",
        LE: "León",
        MD: "Madriz",
        MN: "Managua",
        MS: "Masaya",
        MT: "Matagalpa",
        NS: "Nueva Segovia",
        SJ: "Río San Juan",
        RV: "Rivas",
        AN: "Región Autónoma de la Costa Caribe Norte",
        AS: "Región Autónoma de la Costa Caribe Sur",
    };
    const role = {
        1: "Admin",
        2: "Doctor",
        3: "Asistente",
        4: "Paciente",
    }

    function getStateName(abr) {
        return departamentosNicaragua[abr] || "Unknown";
    }

    function getRoleName(abr) {
        return role[abr] || "Unknown";
    }

    const age = (birthdate) => {
        const currentDate = new Date();
        const fechaNacimientoDate = new Date(birthdate);
        let age = currentDate.getFullYear() - fechaNacimientoDate.getFullYear();

        if (fechaNacimientoDate.getMonth() > currentDate.getMonth() || (fechaNacimientoDate.getMonth() === currentDate.getMonth() && fechaNacimientoDate.getDate() > currentDate.getDate())) {
            age--;
        }
        return age;
    };

    async function loadData() {
        if (value === "Paciente") {
            await getSpecificPatient(id)
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            await getAllAppointmentsByPatient(id)
                .then((response) => {
                    setAppoitmentsPending(response.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        else if (value === "Personal") {
            await getSpecificPersonal(id)
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }
    React.useEffect(() => {
        loadData();
    }, [id])

    return (
        <>
            <div className="h-[88vh] overflow-scroll">
                <div className="flex flex-col md:flex-row gap-2 mb-2">
                    <div className="flex flex-col bg-[#F2F5F8] p-5 rounded">
                        <Dropdown radius="sm">
                            <DropdownTrigger>
                                <Avatar
                                    src={user.gender === 'M' ? "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" : "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg"}
                                    className="w-60 h-60 text-large mb-5 m-auto cursor-pointer"
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Actions">
                                <DropdownItem key="edit" startContent={<PencilSquareIcon className="w-4 h-4" />} onPress={onOpen}>Modificar</DropdownItem>
                                <DropdownItem
                                    key="status"
                                    className={user.status === true ? 'text-danger' : 'text-success'}
                                    color={user.status === true ? 'danger' : 'success'}
                                    startContent={user.status === true ? <MinusCircleIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
                                    onPress={async () => {
                                        await sweetAlert("¿Estás seguro?", `${user.first_name} ${user.first_lastname} será dado de ${user.status === true ? "baja" : "alta"}`, "warning", "success", `${user.first_name} ${user.first_lastname} fue dado de ${user.status === true ? "baja" : "alta"}`);
                                        user.status = user.status === false ? true : false;
                                        value === "Paciente" ? putPatient(id, user) : putPersonal(id, user)
                                            .then(() => {
                                                loadData();
                                            })
                                            .catch((error) => {
                                                console.error('Error:', error);
                                            });
                                    }}>
                                    {user.status === true ? 'Dar de baja' : 'Dar de alta'}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Badge content="" size="lg" color={user.status === true ? "success" : "danger"}>
                            <h1 className="text-2xl font-bold m-auto">
                                {user.first_name} {user.first_lastname}
                            </h1>
                        </Badge>
                        <small className="text-base m-auto mb-5">{user.email}</small>
                        <Button
                            className="bg-[#1E1E1E] text-white"
                            radius="sm"
                            size="lg"
                            startContent={
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                                </svg>
                            }
                            onClick={() => window.open("https://wa.me/" + `${user.phone_number}`, "_blank")}>
                            Enviar Mensaje
                        </Button>
                    </div>

                    <div className="flex flex-col bg-[#F2F5F8] p-5 rounded w-full">
                        <div className="flex flex-row">
                            <div className="flex-1">
                                <p className="text-small font-bold text-foreground/80 my-4">Nombre Completo</p>
                                <h3 className="font-semibold text-foreground/90 my-4 mr-3">{user.first_name} {user.middle_name} {user.first_lastname} {user.second_lastname}</h3>
                            </div>
                            <div className="flex-1">
                                <p className="text-small font-bold text-foreground/80 my-4">Género</p>
                                <h3 className="font-semibold text-foreground/90 my-4">{user.gender === "F" ? "Femenino" : "Masculino"}</h3>
                            </div>
                            <div className="flex-1">
                                <p className="text-small font-bold text-foreground/80 my-4">Fecha de Nacimiento</p>
                                <h3 className="font-semibold text-foreground/90 my-4">{user.birthdate} | {age(user.birthdate)} años</h3>
                            </div>
                        </div>

                        <Divider className="my-5" orientation="horizontal" />

                        <div className="flex flex-row">
                            <div className="flex-1">
                                <p className="text-small font-bold text-foreground/80 my-4">Dirección</p>
                                <h3 className="font-semibold text-foreground/90 my-4 mr-3">{user.address}</h3>
                            </div>
                            <div className="flex-1">
                                <p className="text-small font-bold text-foreground/80 my-4">Ciudad</p>
                                <h3 className="font-semibold text-foreground/90 my-4">{getStateName(user.origin)}</h3>
                            </div>
                            {value === "Paciente" ?
                                <div className="flex-1">
                                    <p className="text-small font-bold text-foreground/80 my-4">Ocupación</p>
                                    <h3 className="font-semibold text-foreground/90 my-4">{user.occupation}</h3>
                                </div>
                                :
                                <div className="flex-1">
                                    <p className="text-small font-bold text-foreground/80 my-4">Rol</p>
                                    <h3 className="font-semibold text-foreground/90 my-4">{getRoleName(user.role)}</h3>
                                </div>
                            }
                        </div>

                        {value === "Paciente" &&
                            <>
                                <Divider className="my-5" orientation="horizontal" />

                                <div className="flex flex-row">
                                    <div className="flex-1">
                                        <p className="text-small font-bold text-foreground/80 my-4">Celular</p>
                                        <h3 className="font-semibold text-foreground/90 my-4">+505 {user.phone_number}</h3>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-small font-bold text-foreground/80 my-4">Contacto de Emergencia</p>
                                        <h3 className="font-semibold text-foreground/90 my-4">{user.emergency_contact}</h3>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-small font-bold text-foreground/80 my-4">Celular de Emergencia</p>
                                        <h3 className="font-semibold text-foreground/90 my-4">+505 {user.emergency_number}</h3>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    <div className="flex flex-col bg-[#F2F5F8] p-5 rounded w-full md:w-1/2">
                        <div className="flex justify-between">
                            <Typography className="mb-2" variant="h5">Notas</Typography>
                            <Typography className="mb-2" variant="paragraph">
                                <ChevronDownIcon className="w-5 h-5 cursor-pointer" />
                            </Typography>
                        </div>
                        <Textarea
                            size="md"
                            radius="sm"
                            minRows={7}
                            className="w-full mb-2"
                            placeholder="Escribe aquí . . . "
                        />
                        <Button
                            className="bg-[#1E1E1E] text-white mb-2"
                            size="lg"
                            radius="sm">
                            Guardar
                        </Button>
                        <Table
                            hideHeader
                            aria-label="Files Table"
                            radius="sm"
                            shadow="none"
                            className="h-[7rem]">
                            <TableHeader>
                                <TableColumn>Name</TableColumn>
                                <TableColumn>Actions</TableColumn>
                            </TableHeader>
                            <TableBody>
                                <TableRow key="1">
                                    <TableCell>File 1</TableCell>
                                    <TableCell>Ver</TableCell>
                                </TableRow>
                                <TableRow key="2">
                                    <TableCell>File 2</TableCell>
                                    <TableCell>Ver</TableCell>
                                </TableRow>
                                <TableRow key="3">
                                    <TableCell>File 3</TableCell>
                                    <TableCell>Ver</TableCell>
                                </TableRow>
                                <TableRow key="4">
                                    <TableCell>File 4</TableCell>
                                    <TableCell>Ver</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 h-[22.5rem]">
                    <div className="flex flex-col bg-[#F2F5F8] p-5 rounded w-full">
                        <Tabs
                            aria-label="Options"
                            color="primary"
                            classNames={{ cursor: "bg-[#1E1E1E] rounded-md" }}
                            fullWidth
                            size="md">
                            <Tab key="appointments" title="Citas">
                                <Tabs
                                    aria-label="Options"
                                    color="primary"
                                    classNames={{ cursor: "bg-[#1E1E1E] rounded-md" }}
                                    fullWidth
                                    size="md">
                                    <Tab key="appointments_pending" title="Citas Pendientes">
                                        <Card
                                            radius="sm"
                                            shadow="none">
                                            <CardBody>
                                                <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-[28vh] overflow-scroll'>
                                                    {appoitmentsPending
                                                        .filter(info => info.status === 1)
                                                        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                                                        .map((appointment) => (
                                                            <div className="w-full md:w-1/2" key={appointment.id}>
                                                                <AppointmentCard
                                                                    id={appointment.id}
                                                                    reason={appointment.reason}
                                                                    personal={
                                                                        (appointment['personal_data'].gender === "F" ? "Dra. " : "Dr. ") +
                                                                        appointment['personal_data'].first_name + ' ' +
                                                                        appointment['personal_data'].middle_name + ' ' +
                                                                        appointment['personal_data'].first_lastname + ' ' +
                                                                        appointment['personal_data'].second_lastname
                                                                    }
                                                                    date={appointment.datetime}
                                                                    view={'patient_detail'}
                                                                    appointmentType={'pending'}
                                                                />
                                                            </div>
                                                        ))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Tab>

                                    <Tab key="appointment_done" title="Citas Realizadas">
                                        <Card
                                            radius="sm"
                                            shadow="none">
                                            <CardBody>
                                                <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-[28vh] overflow-scroll'>
                                                    {appoitmentsPending
                                                        .filter(info => info.status === 3)
                                                        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                                                        .map((appointment) => (
                                                            <div className="w-full md:w-1/2" key={appointment.id}>
                                                                <AppointmentCard
                                                                    id={appointment.id}
                                                                    reason={appointment.reason}
                                                                    personal={
                                                                        (appointment['personal_data'].gender === "F" ? "Dra. " : "Dr. ") +
                                                                        appointment['personal_data'].first_name + ' ' +
                                                                        appointment['personal_data'].middle_name + ' ' +
                                                                        appointment['personal_data'].first_lastname + ' ' +
                                                                        appointment['personal_data'].second_lastname
                                                                    }
                                                                    date={appointment.datetime}
                                                                    view={'patient_detail'}
                                                                    observation={appointment.observation}
                                                                    appointmentType={'done'}
                                                                />
                                                            </div>
                                                        ))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Tab>

                                    <Tab key="appointment_cancelled" title="Citas Canceladas">
                                        <Card
                                            radius="sm"
                                            shadow="none">
                                            <CardBody>
                                                <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-[28vh] overflow-scroll'>
                                                    {appoitmentsPending
                                                        .filter(info => info.status === 2)
                                                        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                                                        .map((appointment) => (
                                                            <div className="w-full md:w-1/2" key={appointment.id}>
                                                                <AppointmentCard
                                                                    id={appointment.id}
                                                                    reason={appointment.reason}
                                                                    personal={
                                                                        (appointment['personal_data'].gender === "F" ? "Dra. " : "Dr. ") +
                                                                        appointment['personal_data'].first_name + ' ' +
                                                                        appointment['personal_data'].middle_name + ' ' +
                                                                        appointment['personal_data'].first_lastname + ' ' +
                                                                        appointment['personal_data'].second_lastname
                                                                    }
                                                                    date={appointment.datetime}
                                                                    view={'patient_detail'}
                                                                    appointmentType={'cancelled'}
                                                                    observation={appointment.observation}
                                                                />
                                                            </div>
                                                        ))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Tab>
                                </Tabs>
                            </Tab>
                            <Tab key="videos" title="¿Historial Médico?">
                                <Card
                                    radius="sm"
                                    shadow="none">
                                    <CardBody>
                                        ¿Historial Médico?
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                    </div>
                    <div className="flex flex-col bg-[#F2F5F8] p-5 rounded w-full md:w-1/2">
                        <Typography variant="h5">Archivos</Typography>
                        <Input
                            type="file"
                            radius="sm"
                            className="mb-2"
                        />
                        <Table
                            hideHeader
                            aria-label="Files Table"
                            radius="sm"
                            shadow="none"
                            className="h-[7rem]">
                            <TableHeader>
                                <TableColumn>Name</TableColumn>
                                <TableColumn>Actions</TableColumn>
                            </TableHeader>
                            <TableBody>
                                <TableRow key="1">
                                    <TableCell>File 1</TableCell>
                                    <TableCell>Ver</TableCell>
                                </TableRow>
                                <TableRow key="2">
                                    <TableCell>File 2</TableCell>
                                    <TableCell>Ver</TableCell>
                                </TableRow>
                                <TableRow key="3">
                                    <TableCell>File 3</TableCell>
                                    <TableCell>Ver</TableCell>
                                </TableRow>
                                <TableRow key="4">
                                    <TableCell>File 4</TableCell>
                                    <TableCell>Ver</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                    </div>
                </div>
                <UserModal isOpen={isOpen} onOpenChange={onOpenChange} updateData={loadData} value={value} />
            </div>
        </>
    );
}
