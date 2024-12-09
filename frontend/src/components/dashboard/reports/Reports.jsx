import { Button, DateRangePicker, Select, Spinner, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { getAllPayment, getAllPaymentControl } from "../../../api/apiFunctions";
import { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { parseDate } from "@internationalized/date";
import { generateExcel } from "./Excel";
import clsx from 'clsx';
import { createContext } from "react";
import { Pdf } from "./Pdf";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { getAllTreatment } from "../../../api/apiFunctions";
import { sweetToast } from "../Alerts";

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


const columnsTrataments = [
    {
        key: "1",
        label: "Tratamiento",
    },
    {
        key: "2",
        label: "Precio"
    }
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
    { key: 1, label: "Tratamientos" },
    { key: 2, label: "Control de Pagos" },
];

export const formatCurrency = (value) => {
    return value.toLocaleString('es-NI', {
        style: 'currency',
        currency: 'NIO',
        minimumFractionDigits: 2
    });
}


const ListReports = Object.freeze({
    Treatment: 1,
    PaymentControl: 2
});
export const ReportsContext = createContext();

export const Reports = () => {
    const [allPayments, setAllPayments] = useState({});
    const [allTreatment, setAllTreatment] = useState({});
    const [test, setTest] = useState("Hola Mundo")
    const [selectedReport, setSelectedReport] = useState(ListReports.PaymentControl);
    const [reportingDates, setReportingDates] = useState({
        startDate: '2024-01-01',
        endDate: '2024-12-31'
    });
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    useEffect(() => {
        if (reportingDates) {
            const asyncFunc = async () => {
                await loadAllPayment();
            }
            asyncFunc();
        }
    }, [reportingDates]);

    useEffect(() => {
        const asyncFunc = async () => {
            await handleGetAllTreatment();
        }
        asyncFunc();
    }, [])

    const loadAllPayment = async () => {
        try {
            setIsLoadingReport(true);
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
                    //id,
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


            const updateFilter = filterDate.map(item => ({
                ...item,
                created_at: new Date(item.created_at).toLocaleString("en-US"),
                totalPaid: formatCurrency(Number(item.totalPaid)),
                totalSlope: formatCurrency(Number(item.totalSlope)),
                total: formatCurrency(Number(item.total))
            }));
            setAllPayments(updateFilter);
        } catch {
            sweetToast('error', 'Ha ocurrido un error inesperado al obtener lista de control de pagos');
        } finally {
            setIsLoadingReport(false);
        }
    }

    const handleGetAllTreatment = async () => {
        try {
            const response = await getAllTreatment();
            const updateFilter = response.data.map(item => ({
                name: item.name,
                description: item.description,
                price: formatCurrency(Number(item.price)), 
            }));
              console.log(updateFilter)
            setAllTreatment(updateFilter)
        } catch {
            sweetToast('error', 'Ha ocurrido un error inesperado al obtener lista de tratamientos');
        }
    }

    return (
        <ReportsContext.Provider value={{ test }}>
            <div className="flex flex-col w-full gap-y-2">
                <div className="flex flex-rows gap-x-2 flex-wrap md:flex-nowrap gap-y-2">
                    <Select
                        label="Seleccione un Reporte"
                        className={clsx(selectedReport === ListReports.Treatment ? "md:w-1/2" : "md:w-1/3")}
                        //defaultValue={ListReports.PaymentControl}
                        defaultSelectedKeys={[ListReports.PaymentControl.toString()]}
                        onChange={(e) => {

                            if (e.target.value === '') {
                                setSelectedReport(Number(ListReports.PaymentControl));
                            } else {
                                setSelectedReport(Number(e.target.value));
                            }
                        }}
                    >
                        {reportList.map((report) => (
                            <SelectItem key={report.key} value={report.key}>
                                {report.label}
                            </SelectItem>
                        ))}
                    </Select>
                    {selectedReport === ListReports.PaymentControl && <DateRangePicker
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

                    <Button onClick={() => generateExcel(columnsExcel, allPayments)} className={clsx("text-lg w-full h-[55px] bg-[#008f39] text-white font-bold", selectedReport === ListReports.Treatment ? "md:w-1/2" : "md:w-1/3")}>
                        EXCEL
                        <ArrowDownTrayIcon className="w-5 h-5" />
                    </Button>
                    <PDFDownloadLink
                        className={clsx("rounded-lg text-lg w-full h-[55px] bg-[#2c79dd] text-white font-bold", selectedReport === ListReports.Treatment ? "md:w-1/2" : "md:w-1/3")}
                        document={allTreatment?.length > 0 && <Pdf allTreatment={allTreatment} />}
                        fileName="rep.pdf"
                    >
                        {({ loading }) =>
                            loading ? (
                                <button>Descargando</button>
                            ) : (
                                <button className="flex flex-row h-full w-full justify-center item-center gap-2 mt-3">
                                    PDF <ArrowDownTrayIcon className="w-5 h-5 mt-1" />
                                </button>
                            )
                        }
                    </PDFDownloadLink>
                </div>
                <div>
                    {isLoadingReport ? (
                        <div className="flex items-center justify-center w-full h-[50vh]">
                            <Spinner size="lg" />
                        </div>
                    ) : (
                        selectedReport === ListReports.PaymentControl ? (
                            <Table
                                radius="sm"
                                shadow="none"
                                aria-label="Reports"
                                className="h-[50vh] col-span-2"
                            >
                                <TableHeader columns={columns}>
                                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                                </TableHeader>
                                <TableBody emptyContent="No hay información para mostrar">
                                    {allPayments?.length ? (
                                        allPayments.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{`${item.first_name} ${item.first_lastname}`}</TableCell>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell>{item.total}</TableCell>
                                                <TableCell>{item.created_at}</TableCell>

                                                <TableCell>{item.totalPaid}</TableCell>
                                                <TableCell>{item.totalSlope}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : null}
                                </TableBody>
                            </Table>
                        ) : (
                            <Table
                                radius="sm"
                                shadow="none"
                                aria-label="Reports"
                                className="h-[50vh] col-span-2"
                            >
                                <TableHeader columns={columnsTrataments}>
                                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                                </TableHeader>
                                <TableBody emptyContent="No hay información para mostrar">
                                    {allTreatment?.length ? (
                                        allTreatment.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.price}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : null}
                                </TableBody>
                            </Table>
                        )
                    )}

                    <PDFViewer style={{ width: "100%", height: "600px" }}>
                        {(allTreatment?.length > 0) && <Pdf data={allTreatment} />}
                    </PDFViewer>
             
                </div>

            </div>
        </ReportsContext.Provider>
    );
}
