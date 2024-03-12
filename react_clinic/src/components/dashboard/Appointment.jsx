import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid'
import { Input, Button } from '@nextui-org/react'
import { PlusIcon } from "@heroicons/react/24/solid";
import AppointmentCard from './AppointmentCard';

export default function Appointment() {
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
                        >
                            <PlusIcon className="h-7 w-7" />
                        </Button>
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
                        />
                    </div>
                    <div className='flex flex-col w-full md:w-1/3 h-[82vh] overflow-scroll'>
                        <AppointmentCard />
                        <AppointmentCard />
                        <AppointmentCard />
                        <AppointmentCard />
                        <AppointmentCard />
                        <AppointmentCard />
                    </div>
                </div>
            </div>
        </>
    );
}