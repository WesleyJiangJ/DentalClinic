import React from 'react';
import { useParams } from "react-router-dom";
import { getAllAppointments } from '../../api/apiFunctions';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid'
import { Input, Button, useDisclosure } from '@nextui-org/react'
import { PlusIcon } from "@heroicons/react/24/solid";
import AppointmentCard from './AppointmentCard';
import AppointmentModal from './AppointmentModal';

export default function Appointment() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // const param = useParams();
    const [data, setData] = React.useState([]);

    const loadData = async () => {
        const res = await getAllAppointments();
        setData(res.data);
        console.log(data);
    }
    React.useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <div className="flex flex-col">
                <div className='flex flex-row mb-4'>
                    <div className='w-full'>
                        <Input
                            type="text"
                            label="Buscar"
                            radius='sm'
                        />
                    </div>
                    <div>
                        <Button
                            radius='sm'
                            className='mx-2 h-full w-full bg-[#1E1E1E] text-white'
                            isIconOnly
                            onPress={onOpen}
                        >
                            <PlusIcon className="h-7 w-7" />
                        </Button>
                        <AppointmentModal isOpen={isOpen} onOpenChange={onOpenChange} />
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
                                    events: data.map((info) => ({
                                        title: info.observation,
                                        start: info.datetime,
                                        end: info.datetime
                                    })),
                                    color: '#1E1E1E',
                                    textColor: 'white'
                                }
                            ]}
                            businessHours={
                                [
                                    {
                                        daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
                                        startTime: '08:00', // a start time (8am in this example)
                                        endTime: '17:30', // an end time (5:30pm in this example)
                                    },
                                    {
                                        daysOfWeek: [6], // Saturday
                                        startTime: '08:00', // a start time (8am in this example)
                                        endTime: '12:00', // an end time (12:00pm in this example)
                                    }
                                ]

                            }
                        />
                    </div>
                    <div className='flex flex-col w-full md:w-1/3 h-[82vh] overflow-scroll'>
                        {data.map((info) => (
                            <AppointmentCard
                                key={info.id}
                                observation={info.observation}
                                patient={info['patient_data'].first_name + ' ' + info['patient_data'].middle_name + ' ' + info['patient_data'].first_lastname + ' ' + info['patient_data'].second_lastname}
                                personal={'Dr. ' + info['personal_data'].first_name + ' ' + info['personal_data'].middle_name + ' ' + info['personal_data'].first_lastname + ' ' + info['personal_data'].second_lastname}
                                date={info.datetime}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}