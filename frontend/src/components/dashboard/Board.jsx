import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Button, DateRangePicker, Select, SelectItem } from '@nextui-org/react';
import { BuildingStorefrontIcon, MapPinIcon, PhoneIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { getAllAppointments, getAllPatients, getAllPersonal, getPaymentControlFiltered } from '../../api/apiFunctions';
import { getLocalTimeZone, today } from "@internationalized/date";
import Chart from './Chart';

export default function Board() {
    const navigate = useNavigate();
    const [patient, setPatient] = React.useState(0);
    const [doctor, setDoctor] = React.useState(0);
    const [todayAppointment, setTodayAppointment] = React.useState(0);
    const [appointment, setAppointment] = React.useState(0);
    const [totalPaid, setTotalPaid] = React.useState(0);
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [selectedYear, setSelectedYear] = React.useState('');
    const [years, setYears] = React.useState([]);
    const [filteredData, setFilteredData] = React.useState({ completed: [], cancelled: [] });

    React.useEffect(() => {
        loadData();
    }, [startDate, endDate]);

    React.useEffect(() => {
        updateChart();
    }, [selectedYear]);

    const loadData = async () => {
        setPatient((((await getAllPatients()).data).filter(item => item.status === true).length));
        setDoctor((((await getAllPersonal()).data).filter(item => item.status === true && item.role === 2).length));
        setTodayAppointment((((await getAllAppointments()).data).filter(item => item.status === 1 && new Date(item.datetime).toDateString() === new Date().toDateString()).length));
        setAppointment((((await getAllAppointments()).data).filter(item => item.status === 1).length));
        const appointment = (await getAllAppointments()).data;
        const paymentData = ((await getPaymentControlFiltered(startDate, endDate)).data);
        let total = 0;
        paymentData.map((item) => {
            total += parseFloat(item.paid);
        });
        setTotalPaid(total);
        const uniqueYears = [...new Set(appointment.map(appointment => new Date(appointment.datetime).getFullYear()))];
        setYears(uniqueYears);
        setSelectedYear(Math.max(...uniqueYears));
    }

    const handleDate = (e) => {
        const [yearStart, monthStart, dayStart] = [e.start.year, e.start.month, e.start.day];
        const [yearEnd, monthEnd, dayEnd] = [e.end.year, e.end.month, e.end.day];
        const dateStart = (yearStart + '-' + String(monthStart).padStart(2, '0') + '-' + String(dayStart).padStart(2, '0'));
        const dateEnd = (yearEnd + '-' + String(monthEnd).padStart(2, '0') + '-' + String(dayEnd).padStart(2, '0'));
        setStartDate(dateStart);
        setEndDate(dateEnd);
    }

    const updateChart = async () => {
        const appointment = (await getAllAppointments()).data;
        const data = {
            completed: Array(12).fill(0),
            cancelled: Array(12).fill(0),
        };

        appointment.forEach((appointment) => {
            const appointmentDate = new Date(appointment.datetime);
            const year = appointmentDate.getFullYear();
            const month = appointmentDate.getMonth();

            if (year === parseInt(selectedYear, 10)) {
                if (appointment.status === 3) {
                    data.completed[month]++;
                } else if (appointment.status === 2) {
                    data.cancelled[month]++;
                }
            }
        });
        setFilteredData(data);
    }

    return (
        <div className='flex flex-col gap-2 h-full'>
            <div className="flex flex-col md:flex-row gap-2">
                <div className='w-full md:w-2/3'>
                    <Select
                        fullWidth
                        radius='sm'
                        label='Filtrar por año'
                        selectedKeys={[String(selectedYear)]}
                        disallowEmptySelection
                        onChange={(e) => setSelectedYear(e.target.value)}>
                        {years.map((year) => (
                            <SelectItem key={year} value={year} textValue={year}>
                                {year}
                            </SelectItem>
                        ))}
                    </Select>
                    <Chart data={filteredData} />
                </div>
                <div className='flex flex-col gap-2 w-full md:w-1/3'>
                    <div className="flex flex-row gap-2 h-full">
                        <Card
                            fullWidth
                            radius='sm'>
                            <CardHeader>
                                <h2 className='font-semibold text-medium'>Citas de Hoy</h2>
                            </CardHeader>
                            <CardBody className='flex items-center justify-center'>
                                <p className='text-8xl'>{todayAppointment}</p>
                            </CardBody>
                        </Card>
                        <Card
                            fullWidth
                            radius='sm'>
                            <CardHeader>
                                <h2 className='font-semibold text-medium'>Citas Pendientes</h2>
                            </CardHeader>
                            <CardBody className='flex items-center justify-center'>
                                <p className='text-8xl'>{appointment}</p>
                            </CardBody>
                            <CardFooter
                                className='bg-primary'>
                                <Button
                                    radius='sm'
                                    fullWidth
                                    color='primary'
                                    onClick={() => navigate('appointment')}>
                                    <ChevronDoubleRightIcon className='w-5 h-5' />
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="flex flex-row gap-2 h-full">
                        <Card
                            fullWidth
                            radius='sm'>
                            <CardHeader>
                                <h2 className='font-semibold text-medium'>Información de la Clínica</h2>
                            </CardHeader>
                            <CardBody className='justify-evenly'>
                                <div className="flex flex-row gap-2 items-center">
                                    <BuildingStorefrontIcon className='w-5 h-5' />
                                    <p>Clínica Dental</p>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    <PhoneIcon className='w-5 h-5' />
                                    <p>+505 8781 2379</p>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    <MapPinIcon className='w-5 h-5' />
                                    <p>Calle Sonrisas, Narnia</p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
            <div className='flex flex-col md:flex-row h-full gap-2'>
                <div className="flex flex-row gap-2 w-full md:w-1/2">
                    <Card
                        fullWidth
                        radius='sm'>
                        <CardHeader>
                            <h2 className='font-semibold text-medium'>Pacientes</h2>
                        </CardHeader>
                        <CardBody className='flex items-center justify-center'>
                            <p className='text-8xl'>{patient}</p>
                        </CardBody>
                        <CardFooter
                            className='bg-primary'>
                            <Button
                                radius='sm'
                                fullWidth
                                color='primary'
                                onClick={() => navigate('patient')}>
                                <ChevronDoubleRightIcon className='w-5 h-5' />
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card
                        fullWidth
                        radius='sm'>
                        <CardHeader>
                            <h2 className='font-semibold text-medium'>Médicos</h2>
                        </CardHeader>
                        <CardBody className='flex items-center justify-center'>
                            <p className='text-8xl'>{doctor}</p>
                        </CardBody>
                        <CardFooter
                            className='bg-primary'>
                            <Button
                                radius='sm'
                                fullWidth
                                color='primary'
                                onClick={() => navigate('personal')}>
                                <ChevronDoubleRightIcon className='w-5 h-5' />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                <div className="flex flex-row gap-2 w-full md:w-1/2">
                    <Card
                        fullWidth
                        radius='sm'>
                        <CardHeader className="flex flex-row gap-2 justify-between items-center">
                            <h2 className='font-semibold text-medium'>Ingresos</h2>
                            <DateRangePicker
                                aria-labelledby='Date Range'
                                className='w-1/2'
                                radius='sm'
                                visibleMonths={2}
                                label='Rango'
                                maxValue={today(getLocalTimeZone()).add({ days: 1 })}
                                onChange={handleDate}
                            />
                        </CardHeader>
                        <CardBody className='flex items-center justify-center'>
                            <p className='text-8xl'>C${totalPaid.toLocaleString()}</p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}