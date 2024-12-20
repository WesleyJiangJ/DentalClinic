import React from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react'

export default function BudPayCard({ name, description, total, pending, treatmentQuantity }) {
    return (
        <>
            <div className='m-2'>
                <Card
                    shadow='none'
                    radius='sm'
                    className='bg-primary text-white'>
                    <CardHeader>
                        <div className="flex flex-col">
                            <h1 className='text-xl font-bold truncate max-w-xs'>{name}</h1>
                            <p className='text-md font-thin truncate max-w-xs'>{description}</p>
                        </div>
                    </CardHeader>
                    {total !== undefined &&
                        <CardBody>
                            <p>{total}</p>
                            <p>{pending}</p>
                            <p>{treatmentQuantity}</p>
                        </CardBody>
                    }
                </Card >
            </div >
        </>
    );
}