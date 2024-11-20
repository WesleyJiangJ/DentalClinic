import { Button, DateRangePicker, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { getAllPayment, getAllPaymentControl } from "../../../api/apiFunctions";
import { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { parseDate } from "@internationalized/date";
import { generateExcel } from "./Excel";
import clsx from 'clsx';
import { createContext } from "react";
//import { ReportHeader } from "./ReportHeader";

const columns = [
    {
        key: "1",
        label: "Paciente",
    },
    {
        key: "2",
        label: "Tratamientos"
    },
    {
        key: "3",
        label: "Total",
    },
    {
        key: "4",
        label: "Fecha",
    },
    {
        key: "5",
        label: "Total Abonado",
    },
    {
        key: "6",
        label: "Restante",
    },
];

const columnsExcel = [
    "Nombre",
    "Descripción",
    "Fecha",
    "Total",
    "Total Abonado",
    "Restante",
]

const reportList = [
    { key: "paymentControl", label: "Control de Pagos" },
    { key: "treatments", label: "Tratamientos" },
];

export const formatCurrency = (value) => {
    return value.toLocaleString('es-NI', {
        style: 'currency',
        currency: 'NIO',
        minimumFractionDigits: 2
    });
}

export const ReportsContext = createContext();

export const Reports = () => {
    const [allPayments, setAllPayments] = useState({});
    const [test, setTest] = useState("Hola Mundo")
    const [selectedReport, setSelectedReport] = useState('');
    const [reportingDates, setReportingDates] = useState({
        startDate: '2024-01-01',
        endDate: '2024-12-31'
    });
    useEffect(() => {
        if(reportingDates){
            const fetchData = async () => {
                await loadAllPayment();
            }
            fetchData();
        }
    }, [reportingDates]);

    const loadAllPayment = async () => {
        try {
            const res = await getAllPayment();

            const resControl = (await getAllPaymentControl()).data;
            const payments = res.data.map(payment => {

                const {
                    id,
                    created_at,
                    budget_data: { patient_data: { first_lastname, first_name }, description,
                        total = {} } = {},

                } = payment;
                return {
                    id,
                    description,
                    total,
                    first_lastname,
                    first_name,
                    created_at
                };
            });

            const addPaymentControl = payments.map(payment => {
                const paymentControl = resControl.filter(control => control.id_payment === payment.id);
                return {
                    ...payment,
                    totalPaid: paymentControl.reduce((acc, field) => acc + parseFloat(field.paid), 0),
                    totalSlope: Number(payment.total) - paymentControl.reduce((acc, field) => acc + parseFloat(field.paid), 0)
                };
            });

            const filterDate = addPaymentControl.filter(item => {
                const itemDate = item.created_at.substring(0, 10);

                return itemDate >= reportingDates.startDate && itemDate <= reportingDates.endDate;
            });
            setAllPayments(filterDate);
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <ReportsContext.Provider value={{test}}>
            <div className="flex flex-col w-full gap-y-2">
                <div className="flex flex-rows gap-x-2 flex-wrap md:flex-nowrap gap-y-2">
                    <Select
                        label="Seleccione un Reporte"
                        className={clsx(selectedReport === "treatments" ? "md:w-1/2" : "md:w-1/3")}
                        defaultSelectedKeys={["paymentControl"]}
                        onChange={(e) => setSelectedReport(e.target.value)}
                    >
                        {reportList.map((report) => (
                            <SelectItem key={report.key}>
                                {report.label}
                            </SelectItem>
                        ))}
                    </Select>
                    {selectedReport !== "treatments" && <DateRangePicker
                        label="Período"
                        size="md"
                        className="md:w-1/3 w-full"
                        defaultValue={{
                            start: parseDate("2024-01-01"),
                            end: parseDate("2024-12-31"),
                        }}
                        onChange={(e) => {
                            const startDate = e.start;
                            const endDate = e.end;

                            const formatDate = (date) => {
                                const year = date.year;
                                const month = date.month < 10 ? `0${date.month}` : date.month;
                                const day = date.day < 10 ? `0${date.day}` : date.day;
                                return `${year}-${month}-${day}`;
                            };
                            setReportingDates(prevDates => ({
                                ...prevDates,
                                startDate: formatDate(startDate)
                            }));

                            setReportingDates(prevDates => ({
                                ...prevDates,
                                endDate: formatDate(endDate)
                            }));
                        }}
                    />
                    }

                    <Button onClick={() => generateExcel(columnsExcel, allPayments)} className={clsx("text-lg w-full h-[55px] bg-[#008f39] text-white font-bold", selectedReport === "treatments" ? "md:w-1/2" : "md:w-1/3")}>
                        Descargar
                        <ArrowDownTrayIcon className="w-5 h-5" />
                    </Button>
                </div>
                <div>
                    <Table
                        radius="sm"
                        shadow="none"
                        aria-label="Reports"
                        className="h-[50vh] col-span-2">
                        <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody emptyContent={"No hay información para mostrar"}>
                            {allPayments && allPayments.length ? (
                                allPayments.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.first_name + ' ' + item.first_lastname}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{new Date(item.created_at).toLocaleString("en-US")}</TableCell>
                                        <TableCell>{formatCurrency(Number(item.total))}</TableCell>
                                        <TableCell>{formatCurrency(item.totalPaid)}</TableCell>
                                        <TableCell>{formatCurrency(item.totalSlope)}</TableCell>
                                    </TableRow>
                                ))
                            ) : null}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </ReportsContext.Provider>
    );
}
