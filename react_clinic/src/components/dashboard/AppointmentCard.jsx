import React from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react'
import { PencilIcon, CheckIcon, CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/solid";

export default function AppointmentCard({ id, reason, patient, personal, date, onOpen, navigate, view, observation, appointmentType }) {
    const formattedDate = new Date(date).toLocaleString('es-NI', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = new Date(date).toLocaleString('es-NI', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: '2-digit' });
    const currentDate = new Date();
    const currentDateFormat = new Date(currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + String(currentDate.getDate()).padStart(2, '0') + 'T' + String(currentDate.getHours()).padStart(2, '0') + ':' + String(currentDate.getMinutes()).padStart(2, '0') + ':00Z').toISOString();
    const appointmentDate = new Date(date).toISOString();
    const isPastAppointment = currentDateFormat > appointmentDate;

    return (
        <>
            <div className='m-2'>
                <Card
                    shadow='none'
                    className={
                        isPastAppointment === false
                            ?
                            'bg-[#1E1E1E] text-white'
                            :
                            appointmentType === 'done' || appointmentType === 'cancelled'
                                ?
                                'bg-[#1E1E1E] text-white'
                                :
                                'bg-[#C62828] text-white'
                    }
                    radius='sm'>
                    <CardHeader>
                        <div className="flex flex-col">
                            <h1 className='text-xl font-bold'>{reason}</h1>
                            <p className='text-md font-thin'>{observation}</p>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <p>{patient}</p>
                        <p>{personal}</p>
                        <p className='flex flex-row mt-2 items-center'>
                            <CalendarDaysIcon className='w-5 h-5 mr-2' />
                            {formattedDate}
                        </p>
                        <p className='flex flex-row items-center'>
                            <ClockIcon className='w-5 h-5 mr-2' />
                            {formattedTime}
                        </p>
                    </CardBody>
                    {view !== 'patient_detail' &&
                        <CardFooter>
                            <div className='flex flex-row w-full gap-1'>
                                <div className='w-full'>
                                    <Button
                                        className='w-full bg-white'
                                        radius='sm'
                                        onPress={() => {
                                            onOpen();
                                            navigate(`edit/${id}`);
                                        }}>
                                        <PencilIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                                {isPastAppointment !== true &&
                                    <div className='w-full'>
                                        <Button
                                            className='w-full bg-white'
                                            radius='sm'
                                            onPress={() => {
                                                onOpen();
                                                navigate(`check/${id}`);
                                            }}>
                                            <CheckIcon className="h-5 w-5" />
                                        </Button>
                                    </div>
                                }
                            </div>
                        </CardFooter >
                    }
                </Card >
            </div >
        </>
    );
}