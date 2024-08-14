import React from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react'

export default function BudPayCard({ name, description, total, treatmentQuantity }) {
    return (
        <>
            <div className='m-2'>
                <Card
                    shadow='none'
                    radius='sm'
                    className='bg-primary text-white'>
                    <CardHeader>
                        <div className="flex flex-col">
                            <h1 className='text-xl font-bold'>{name}</h1>
                            <p className='text-md font-thin'>{description}</p>
                        </div>
                    </CardHeader>
                    {total !== undefined &&
                        <CardBody>
                            <p>{total}</p>
                            <p>{treatmentQuantity}</p>
                        </CardBody>
                    }
                </Card >
            </div >
        </>
    );
}