import React from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react'
import { PencilIcon, CheckIcon, CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/solid";

export default function AppointmentCard({ id, reason, patient, personal, date, onOpen, navigate }) {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const formattedTime = new Date(date).toISOString().split('T')[1].slice(0, 5);
    return (
        <>
            <div className='m-2'>
                <Card shadow='none' className='bg-[#1E1E1E] text-white' radius='sm'>
                    <CardHeader>
                        <h1 className='text-xl font-bold'>{reason}</h1>
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
                        </div>
                    </CardFooter >
                </Card >
            </div >
        </>
    );
}