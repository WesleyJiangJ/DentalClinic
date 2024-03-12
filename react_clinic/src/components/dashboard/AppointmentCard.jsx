import { Button, Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react'
import { PencilIcon, CheckIcon } from "@heroicons/react/24/solid";

export default function AppointmentCard() {
    return (
        <>
            <div className='m-2'>
                <Card shadow='none' className='bg-[#1E1E1E] text-white' radius='sm'>
                    <CardHeader>
                        <h1>Patient Name</h1>
                    </CardHeader>
                    <CardBody>
                        <p>Date and Doctor's Name</p>
                    </CardBody>
                    <CardFooter>
                        <div className='flex flex-row w-full gap-1'>
                            <div className='w-full'>
                                <Button
                                    className='w-full bg-white'
                                    radius='sm'
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className='w-full'>
                                <Button
                                    className='w-full bg-white'
                                    radius='sm'
                                >
                                    <CheckIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}