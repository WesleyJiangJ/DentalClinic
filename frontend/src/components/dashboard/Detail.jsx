import React from "react";
import { sweetAlert, sweetToast } from './Alerts'
import { getSpecificPatient, putPatient, getSpecificPersonal, putPersonal, getAllAppointmentsByUser, getAllBudgetByPatient, getAllPaymentsByPatient, getOdontogram } from "../../api/apiFunctions";
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, Button, Tabs, Tab, Card, CardHeader, CardBody, Textarea, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDisclosure } from "@nextui-org/react";
import { CheckCircleIcon, ChevronDownIcon, MinusCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid"
import UserModal from "./UserModal"
import AppointmentCard from "./AppointmentCard";
import BudPayCard from "./BudPayCard";
import NewOdontogramModal from "./NewOdontogramModal";

export default function Detail({ value }) {
    const navigate = useNavigate();
    const { isOpen: isUserModalOpen, onOpen: onUserModalOpen, onOpenChange: onUserModalOpenChange } = useDisclosure();
    const { isOpen: isOdontogramModalOpen, onOpen: onOdontogramModalOpen, onOpenChange: onOdontogramModalOpenChange } = useDisclosure();
    const [user, setUser] = React.useState([]);
    const [appoitmentsPending, setAppoitmentsPending] = React.useState([]);
    const [budget, setBudget] = React.useState([]);
    const [payment, setPayment] = React.useState([]);
    const [odontogram, setOdontogram] = React.useState([]);
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
        const birthDate = new Date(birthdate);
        let age = currentDate.getFullYear() - birthDate.getFullYear();

        if (birthDate.getMonth() > currentDate.getMonth() || (birthDate.getMonth() === currentDate.getMonth() && birthDate.getDate() > currentDate.getDate())) {
            age--;
        }
        return age;
    };

    const loadData = async () => {
        if (value === "Paciente") {
            const [patientResponse, appointmentsResponse, budgetResponse, paymentsResponse, odontogramResponse] = await Promise.all([
                getSpecificPatient(id),
                getAllAppointmentsByUser(id, ''),
                getAllBudgetByPatient(id),
                getAllPaymentsByPatient(id),
                getOdontogram('', id),
            ]);

            setUser(patientResponse.data);
            setAppoitmentsPending(appointmentsResponse.data);
            setBudget(budgetResponse.data);
            setPayment(paymentsResponse.data);
            setOdontogram(odontogramResponse.data);
        }
        else if (value === "Personal") {
            setUser((await getSpecificPersonal(id)).data);
            setAppoitmentsPending((await getAllAppointmentsByUser('', id)).data);
        }
    }

    const changeStatus = async () => {
        const pending = appoitmentsPending.filter((appointment) => appointment.status === 1);
        if (pending.length > 0) {
            sweetToast('error', "Tienes citas activas");
        }
        else {
            await sweetAlert("¿Estás seguro?", `${user.first_name} ${user.first_lastname} será dado de ${user.status === true ? "baja" : "alta"}`, "warning", "success", `${user.first_name} ${user.first_lastname} fue dado de ${user.status === true ? "baja" : "alta"}`);
            user.status = user.status === false ? true : false;
            value === "Paciente"
                ?
                putPatient(id, user)
                    .then(() => {
                        loadData();
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    })
                :
                putPersonal(id, user)
                    .then(() => {
                        loadData();
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    })
        }
    }

    const userInformation = [
        {
            firstLabel: "Nombre Completo",
            firstValue: `${user.first_name} ${user.middle_name} ${user.first_lastname} ${user.second_lastname}`,
            secondLabel: "Género",
            secondValue: `${user.gender === "F" ? "Femenino" : "Masculino"}`,
            thirdLabel: "Fecha de Nacimiento",
            thirdValue: `${user.birthdate} | ${age(user.birthdate)} años`,
        },
        {
            firstLabel: "Dirección",
            firstValue: `${user.address}`,
            secondLabel: "Ciudad",
            secondValue: `${getStateName(user.origin)}`,
            thirdLabel: `${value === 'Paciente' ? 'Ocupación' : 'Role'}`,
            thirdValue: `${value === 'Paciente' ? user.occupation : getRoleName(user.role)}`,
        },
        {
            firstLabel: "Celular",
            firstValue: `${user.phone_number}`,
            secondLabel: "Contacto de Emergencia",
            secondValue: `${user.emergency_contact}`,
            thirdLabel: "Contacto de Emergencia",
            thirdValue: `${user.emergency_number}`,
        }
    ]

    React.useEffect(() => {
        loadData();
    }, [id])

    return (
        <>
            <div className="h-full w-full">
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex flex-col md:flex-row w-full gap-2 h-full md:h-[45%]">
                        <Card
                            shadow="none"
                            radius="sm"
                            className="w-full md:w-1/2 p-2 h-full bg-card">
                            <Dropdown radius="sm">
                                <DropdownTrigger>
                                    <Avatar
                                        src={user.gender === 'M' ? "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" : "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg"}
                                        className="w-60 h-60 text-large m-auto cursor-pointer -z-0"
                                    />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Actions">
                                    <DropdownItem key="edit" startContent={<PencilSquareIcon className="w-4 h-4" />} onPress={onUserModalOpen}>Modificar</DropdownItem>
                                    <DropdownItem
                                        key="status"
                                        className={user.status === true ? 'text-danger' : 'text-success'}
                                        color={user.status === true ? 'danger' : 'success'}
                                        startContent={user.status === true ? <MinusCircleIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
                                        onPress={changeStatus}>
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
                                color="primary"
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
                        </Card>
                        <Card
                            shadow="none"
                            radius="sm"
                            fullWidth
                            className="bg-card">
                            <CardHeader>
                                <p className="font-bold text-large">Información</p>
                            </CardHeader>
                            <CardBody
                                className="justify-evenly">
                                <UserInformation
                                    firstLabel={userInformation[0].firstLabel}
                                    secondLabel={userInformation[0].secondLabel}
                                    thirdLabel={userInformation[0].thirdLabel}
                                    firstValue={userInformation[0].firstValue}
                                    secondValue={userInformation[0].secondValue}
                                    thirdValue={userInformation[0].thirdValue}
                                />
                                <UserInformation
                                    firstLabel={userInformation[1].firstLabel}
                                    secondLabel={userInformation[1].secondLabel}
                                    thirdLabel={userInformation[1].thirdLabel}
                                    firstValue={userInformation[1].firstValue}
                                    secondValue={userInformation[1].secondValue}
                                    thirdValue={userInformation[1].thirdValue}
                                />
                                {value === "Paciente" &&
                                    <UserInformation
                                        firstLabel={userInformation[2].firstLabel}
                                        secondLabel={userInformation[2].secondLabel}
                                        thirdLabel={userInformation[2].thirdLabel}
                                        firstValue={userInformation[2].firstValue}
                                        secondValue={userInformation[2].secondValue}
                                        thirdValue={userInformation[2].thirdValue}
                                    />
                                }
                            </CardBody>
                        </Card>
                        <Card
                            shadow="none"
                            radius="sm"
                            className="w-full md:w-1/2">
                            <Notes />
                        </Card>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 h-[54%]">
                        <Card
                            shadow="none"
                            radius="sm"
                            className="w-full md:w-2/3 h-full bg-card"
                            fullWidth>
                            <CardBody>
                                <Tabs
                                    aria-label="Options"
                                    color="primary"
                                    radius="sm"
                                    fullWidth
                                    size="md">
                                    <Tab key="appointments" title="Citas">
                                        <Tabs
                                            aria-label="Options"
                                            color="primary"
                                            radius="sm"
                                            fullWidth
                                            size="md">
                                            <Tab key="appointments_pending" title="Citas Pendientes">
                                                <Card
                                                    radius="sm"
                                                    shadow="none"
                                                    className="h-full">
                                                    <CardBody>
                                                        <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-full overflow-scroll'>
                                                            {appoitmentsPending
                                                                .filter(info => info.status === 1)
                                                                .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                                                                .map((appointment) => (
                                                                    <div className="w-full md:w-1/2" key={appointment.id}>
                                                                        <AppointmentCard
                                                                            id={appointment.id}
                                                                            reason={appointment.reason}
                                                                            personal={
                                                                                (value === 'Paciente' ? appointment['personal_data'].gender === "F" ? "Dra. " : "Dr. " : "") +
                                                                                appointment[value === 'Paciente' ? 'personal_data' : 'patient_data'].first_name + ' ' +
                                                                                appointment[value === 'Paciente' ? 'personal_data' : 'patient_data'].middle_name + ' ' +
                                                                                appointment[value === 'Paciente' ? 'personal_data' : 'patient_data'].first_lastname + ' ' +
                                                                                appointment[value === 'Paciente' ? 'personal_data' : 'patient_data'].second_lastname
                                                                            }
                                                                            date={appointment.datetime}
                                                                            view={'patient_detail'}
                                                                            appointmentType={'pending'}
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                            {appoitmentsPending.filter(info => info.status === 1).length === 0 && (
                                                                <Card radius="sm" shadow="none" fullWidth>
                                                                    <CardBody className="flex items-center justify-center h-full">
                                                                        No hay citas pendientes
                                                                    </CardBody>
                                                                </Card>
                                                            )}
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                            <Tab key="appointment_done" title="Citas Realizadas">
                                                <Card
                                                    radius="sm"
                                                    shadow="none"
                                                    className="h-full">
                                                    <CardBody>
                                                        <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-full overflow-scroll'>
                                                            {appoitmentsPending
                                                                .filter(info => info.status === 3)
                                                                .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                                                                .map((appointment) => (
                                                                    <div className="w-full md:w-1/2" key={appointment.id}>
                                                                        <AppointmentCard
                                                                            id={appointment.id}
                                                                            reason={appointment.reason}
                                                                            personal={
                                                                                (value === 'Paciente' ? appointment['personal_data'].gender === "F" ? "Dra. " : "Dr. " : "") +
                                                                                appointment[value === 'Paciente' ? 'personal_data' : 'patient_data'].first_name + ' ' +
                                                                                appointment[value === 'Paciente' ? 'personal_data' : 'patient_data'].middle_name + ' ' +
                                                                                appointment[value === 'Paciente' ? 'personal_data' : 'patient_data'].first_lastname + ' ' +
                                                                                appointment[value === 'Paciente' ? 'personal_data' : 'patient_data'].second_lastname
                                                                            }
                                                                            date={appointment.datetime}
                                                                            view={'patient_detail'}
                                                                            observation={appointment.observation}
                                                                            appointmentType={'done'}
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                            {appoitmentsPending.filter(info => info.status === 3).length === 0 && (
                                                                <Card radius="sm" shadow="none" fullWidth>
                                                                    <CardBody className="flex items-center justify-center h-full">
                                                                        No hay citas realizadas
                                                                    </CardBody>
                                                                </Card>
                                                            )}
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Tab>

                                            <Tab key="appointment_cancelled" title="Citas Canceladas">
                                                <Card
                                                    radius="sm"
                                                    shadow="none"
                                                    className="h-full">
                                                    <CardBody>
                                                        <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-full overflow-scroll'>
                                                            {appoitmentsPending
                                                                .filter(info => info.status === 2)
                                                                .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                                                                .map((appointment) => (
                                                                    <div className="w-full md:w-1/2" key={appointment.id}>
                                                                        <AppointmentCard
                                                                            id={appointment.id}
                                                                            reason={appointment.reason}
                                                                            personal={
                                                                                (value === 'Paciente' ? appointment['personal_data'].gender === "F" ? "Dra. " : "Dr. " : "") +
                                                                                appointment[value === 'Paciente' ? 'personal_data' : 'patient_data'].first_name + ' ' +
                                                                                appointment[value === 'Paciente' ? 'personal_data' : 'patient_data'].middle_name + ' ' +
                                                                                appointment[value === 'Paciente' ? 'personal_data' : 'patient_data'].first_lastname + ' ' +
                                                                                appointment[value === 'Paciente' ? 'personal_data' : 'patient_data'].second_lastname
                                                                            }
                                                                            date={appointment.datetime}
                                                                            view={'patient_detail'}
                                                                            appointmentType={'cancelled'}
                                                                            observation={appointment.observation}
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                            {appoitmentsPending.filter(info => info.status === 2).length === 0 && (
                                                                <Card radius="sm" shadow="none" fullWidth>
                                                                    <CardBody className="flex items-center justify-center h-full">
                                                                        No hay citas canceladas
                                                                    </CardBody>
                                                                </Card>
                                                            )}
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                        </Tabs>
                                    </Tab>
                                    <Tab key="budget" title="Presupuestos">
                                        <Card
                                            radius="sm"
                                            shadow="none"
                                            className="h-full">
                                            <CardBody>
                                                <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-full overflow-scroll'>
                                                    {budget
                                                        .filter(info => info.status === true)
                                                        .sort((a, b) => new Date(a.created_by) - new Date(b.created_by))
                                                        .map((budget) => (
                                                            <div className="w-full md:w-1/2" key={budget.id}>
                                                                <BudPayCard
                                                                    name={budget.name}
                                                                    description={budget.description}
                                                                    total={'Total C$' + parseFloat(budget.total).toLocaleString()}
                                                                    treatmentQuantity={`${budget.detailFields.length} Tratamientos a Realizar`}
                                                                />
                                                            </div>
                                                        ))
                                                    }
                                                    {budget.filter(info => info.status === true).length === 0 && (
                                                        <Card radius="sm" shadow="none" fullWidth>
                                                            <CardBody className="flex items-center justify-center h-full">
                                                                No se encontraron presupuestos
                                                            </CardBody>
                                                        </Card>
                                                    )}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Tab>
                                    <Tab key="payments" title="Control de Pagos">
                                        <Tabs
                                            aria-label="Options"
                                            color="primary"
                                            radius="sm"
                                            fullWidth
                                            size="md">
                                            <Tab key="pending" title="Pendientes">
                                                <Card
                                                    radius="sm"
                                                    shadow="none"
                                                    className="h-full">
                                                    <CardBody>
                                                        <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-full overflow-scroll'>
                                                            {payment
                                                                .filter(info => info.status === true)
                                                                .sort((a, b) => new Date(a.created_by) - new Date(b.created_by))
                                                                .map((payment) => (
                                                                    <div className="w-full md:w-1/2" key={payment.id}>
                                                                        <BudPayCard
                                                                            name={payment.budget_data.name}
                                                                            description={payment.budget_data.description}
                                                                            total={'Total C$' + parseFloat(payment.budget_data.total).toLocaleString()}
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                            {payment.filter(info => info.status === true).length === 0 && (
                                                                <Card radius="sm" shadow="none" fullWidth>
                                                                    <CardBody className="flex items-center justify-center h-full">
                                                                        No se encontraron pagos pendientes
                                                                    </CardBody>
                                                                </Card>
                                                            )}
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                            <Tab key="paymentsCompleted" title="Pagados">
                                                <Card
                                                    radius="sm"
                                                    shadow="none"
                                                    className="h-full">
                                                    <CardBody>
                                                        <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-full overflow-scroll'>
                                                            {payment
                                                                .filter(info => info.status === false)
                                                                .sort((a, b) => new Date(a.created_by) - new Date(b.created_by))
                                                                .map((payment) => (
                                                                    <div className="w-full md:w-1/2" key={payment.id}>
                                                                        <BudPayCard
                                                                            name={payment.budget_data.name}
                                                                            description={payment.budget_data.description}
                                                                            total={'Total C$' + parseFloat(payment.budget_data.total).toLocaleString()}
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                            {payment.filter(info => info.status === false).length === 0 && (
                                                                <Card radius="sm" shadow="none" fullWidth>
                                                                    <CardBody className="flex items-center justify-center h-full">
                                                                        No se encontraron tratamientos pagados
                                                                    </CardBody>
                                                                </Card>
                                                            )}
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                        </Tabs>
                                    </Tab>
                                    <Tab key="odontogram" title="Odontograma">
                                        <Card
                                            radius="sm"
                                            shadow="none"
                                            className="h-full">
                                            <CardBody>
                                                <Button color="primary" radius="sm" size="lg" onClick={onOdontogramModalOpen}>Nuevo</Button>
                                                <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-full overflow-scroll'>
                                                    {odontogram
                                                        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                                                        .map((odontogram) => (
                                                            <div className="cursor-pointer w-full md:w-1/2" key={odontogram.id} onClick={() => navigate(`/dashboard/patient/odontogram/${odontogram.id}`)}>
                                                                <BudPayCard
                                                                    name={odontogram.name}
                                                                />
                                                            </div>
                                                        ))
                                                    }
                                                    {odontogram.length === 0 && (
                                                        <Card radius="sm" shadow="none" fullWidth>
                                                            <CardBody className="flex items-center justify-center h-full">
                                                                No se encontraron odontogramas
                                                            </CardBody>
                                                        </Card>
                                                    )}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Tab>
                                </Tabs>
                            </CardBody>
                        </Card>

                        <Card
                            shadow="none"
                            radius="sm"
                            className="w-full md:w-2/6 h-full bg-card">
                            <CardBody>
                                <p className="font-bold text-large">Archivos</p>
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
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
            <UserModal isOpen={isUserModalOpen} onOpenChange={onUserModalOpenChange} updateData={loadData} value={value} />
            <NewOdontogramModal isOpen={isOdontogramModalOpen} onOpenChange={onOdontogramModalOpenChange} id_patient={id} navigate={navigate} />
        </>
    );
}

function UserInformation({ firstLabel, secondLabel, thirdLabel, firstValue, secondValue, thirdValue }) {
    return (
        <>
            <div className="flex flex-col md:flex-row">
                <div className="flex-1">
                    <p className="text-small font-bold text-foreground/80 my-4">{firstLabel}</p>
                    <h3 className="font-semibold text-foreground/90 my-4 mr-3">{firstValue}</h3>
                </div>
                <div className="flex-1">
                    <p className="text-small font-bold text-foreground/80 my-4">{secondLabel}</p>
                    <h3 className="font-semibold text-foreground/90 my-4">{secondValue}</h3>
                </div>
                <div className="flex-1">
                    <p className="text-small font-bold text-foreground/80 my-4">{thirdLabel}</p>
                    <h3 className="font-semibold text-foreground/90 my-4">{thirdValue}</h3>
                </div>
            </div>
        </>
    );
}

function Notes() {
    return (
        <Card
            radius="sm"
            className="bg-card">
            <CardHeader className="flex justify-between">
                <p className="font-bold text-large">Notas</p>
                <ChevronDownIcon className="w-5 h-5 cursor-pointer" />
            </CardHeader>
            <CardBody>
                <Textarea
                    size="md"
                    radius="sm"
                    minRows={7}
                    className="w-full mb-2"
                    placeholder="Escribe aquí . . . "
                />
                <Button
                    className="mb-2"
                    color="primary"
                    size="lg"
                    radius="sm">
                    Guardar
                </Button>
                <Table
                    hideHeader
                    aria-label="Files Table"
                    radius="sm"
                    shadow="none"
                // className="h-[9rem]"
                >
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow key="1">
                            <TableCell>File 1</TableCell>
                            <TableCell>Ver</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    );
}