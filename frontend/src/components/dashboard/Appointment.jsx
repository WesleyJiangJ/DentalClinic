import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { getAllAppointments } from '../../api/apiFunctions';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid'
import { Input, Button, useDisclosure, Select, SelectItem } from '@nextui-org/react'
import { PlusIcon } from "@heroicons/react/24/solid";
import AppointmentCard from './AppointmentCard';
import AppointmentModal from './AppointmentModal';

export default function Appointment() {
    const location = useLocation();
    const navigate = useNavigate();
    const param = useParams();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [data, setData] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");
    const [filterValue, setFilterValue] = React.useState(1);
    const [filterData, setFilterData] = React.useState("");
    const currentDate = new Date();

    const loadData = async () => {
        const res = await getAllAppointments();
        setData(res.data);
    }

    const reloadData = async () => {
        await loadData();
    }

    const modifyURL = () => {
        const currentPath = location.pathname;
        const newPath = currentPath.split('/').filter((segment) => segment !== param.id && segment !== param.slug).join('/');
        navigate(newPath);
    }

    React.useEffect(() => {
        loadData();
        if (param.id) {
            modifyURL();
        }
    }, []);

    // Search
    const filteredAppointments = data.filter(info => {
        const patientFullName = `${info[filterData].first_name} ${info[filterData].middle_name} ${info[filterData].first_lastname} ${info[filterData].second_lastname}`;
        return patientFullName.toLowerCase().includes(searchValue.toLowerCase());
    });

    const filter = (e) => {
        setFilterValue(Number(e.target.value));
    };

    // Filter
    React.useEffect(() => {
        if (filterValue === 1) {
            setFilterData('patient_data');
        }
        else {
            setFilterData('personal_data');
        }
    }, [filterValue]);

    return (
        <>
            <div className="flex flex-col">
                <div className='flex flex-row mb-4 gap-2'>
                    <div className='w-full'>
                        <Input
                            type="text"
                            label="Buscar"
                            radius='sm'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                    <div>
                        <Select
                            label="Filtrar"
                            onChange={filter}
                            defaultSelectedKeys={'1'}
                            className="w-28 md:w-32"
                            radius="sm"
                            disallowEmptySelection>
                            <SelectItem key={1} value={1}>Paciente</SelectItem>
                            <SelectItem key={2} value={2}>Doctor</SelectItem>
                        </Select>
                    </div>
                    <div>
                        <Button
                            radius='sm'
                            color="primary"
                            className='p-3 h-full w-full'
                            isIconOnly
                            onPress={onOpen}
                        >
                            <PlusIcon className="h-7 w-7" />
                        </Button>
                        <AppointmentModal
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                            reloadData={reloadData}
                            param={param}
                            modifyURL={modifyURL}
                        />
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='w-full hidden md:block'>
                        <FullCalendar
                            headerToolbar={{
                                start: 'today prev next',
                                center: 'title',
                                end: 'dayGridMonth timeGridWeek timeGridDay listWeek',
                            }}
                            buttonIcons={{
                                prev: 'chevron-left',
                                next: 'chevron-right',
                            }}
                            buttonText={{
                                today: 'Hoy',
                                month: 'Mes',
                                week: 'Semana',
                                day: 'Día',
                                list: 'Agenda'
                            }}
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                            initialView="dayGridMonth"
                            height={"82vh"}
                            nowIndicator={true}
                            eventSources={[
                                {
                                    events: filteredAppointments
                                        .filter(info => info.status === 1)
                                        .map((info) => ({
                                            title: info.reason,
                                            start: info.datetime.slice(0, -1),
                                            end: info.datetime,
                                            color: (new Date(info.datetime).toISOString() < new Date(currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + String(currentDate.getDate()).padStart(2, '0') + 'T' + String(currentDate.getHours()).padStart(2, '0') + ':' + String(currentDate.getMinutes()).padStart(2, '0') + ':00Z').toISOString()) ? "#C62828" : "#1E1E1E",
                                            textColor: 'white'
                                        })),
                                }
                            ]}
                            businessHours={
                                [
                                    {
                                        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
                                        startTime: '08:00', // a start time (8:00 am)
                                        endTime: '17:30', // an end time (5:30 pm)
                                    },
                                    {
                                        daysOfWeek: [6], // Saturday
                                        startTime: '08:00', // a start time (8:00 am)
                                        endTime: '12:00', // an end time (12:00 pm)
                                    }
                                ]

                            }
                        />
                    </div>
                    <div className='flex flex-col w-full md:w-1/3 h-[82vh] overflow-scroll'>
                        {filteredAppointments
                            .filter(info => info.status === 1)
                            .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                            .map((info) => (
                                <AppointmentCard
                                    key={info.id}
                                    id={info.id}
                                    reason={info.reason}
                                    patient={`${info['patient_data'].first_name} ${info['patient_data'].middle_name} ${info['patient_data'].first_lastname} ${info['patient_data'].second_lastname}`}
                                    personal={`${info['personal_data'].gender === "F" ? "Dra. " : "Dr. "} ${info['personal_data'].first_name} ${info['personal_data'].middle_name} ${info['personal_data'].first_lastname} ${info['personal_data'].second_lastname}`}
                                    date={info.datetime}
                                    gender={info['personal_data'].gender}
                                    onOpen={onOpen}
                                    navigate={navigate}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}