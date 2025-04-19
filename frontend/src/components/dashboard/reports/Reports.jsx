import { Button, DateRangePicker, Select, Spinner, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { parseDate } from "@internationalized/date";
import clsx from 'clsx';
import { createContext } from "react";
import { getAllTreatment } from "../../../api/apiFunctions";
import { sweetToast } from "../Alerts";
import useAllPayment from "../../../hooks/useAllPayment";
import useExcelReportGenerator from "../../../hooks/useExcelReportGenerator";
import { getAllAppointments } from "../../../api/apiFunctions";
import { Pdf } from "./Pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
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

const columnsMedicalAppointments = [
    {
        key: "1",
        label: "Doctor",
    },
    {
        key: "2",
        label: "Médico"
    },
    {
        key: "3",
        label: "Razón"
    },
    {
        key: "4",
        label: "Fecha"
    }
];

const reportList = [
    { key: 1, label: "Tratamientos" },
    { key: 2, label: "Control de Pagos" },
    { key: 3, label: "Citas" },
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
    PaymentControl: 2,
    MedicalAppointments: 3
});
export const ReportsContext = createContext();

export const Reports = () => {

    const [allTreatment, setAllTreatment] = useState({});
    const [selectedReport, setSelectedReport] = useState(ListReports.PaymentControl);
    const [reportingDates, setReportingDates] = useState({
        startDate: '2025-01-01',
        endDate: '2025-12-31'
    });
    const [medicalAppointments, setMedicalAppointments] = useState([]);
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const { allPayments } = useAllPayment(reportingDates, setIsLoadingReport);
    const {
        downloadReportTrataments,
        downloadReportPayments,
        downloadReportMedicalAppointments,
    } = useExcelReportGenerator(allTreatment, medicalAppointments, allPayments);
    useEffect(() => {
        const asyncFunc = async () => {
            await handleGetAllTreatment();
            await loadMedicalAppointments();
        }
        asyncFunc();
    }, []);

    const handleGetAllTreatment = async () => {
        try {
            const response = await getAllTreatment();
            const updateFilter = response.data.map(item => ({
                name: item.name,
                description: item.description,
                price: formatCurrency(Number(item.price)),
            }));
            setAllTreatment(updateFilter)
        } catch {
            sweetToast('error', 'Ha ocurrido un error inesperado al obtener lista de tratamientos');
        }
    }
    const loadMedicalAppointments = async () => {
        try {
            const res = await getAllAppointments();
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const day = String(date.getUTCDate()).padStart(2, '0');
                const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                const year = date.getUTCFullYear();

                let hours = date.getUTCHours();
                const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
                const formattedHours = String(hours).padStart(2, '0');

                return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
            };
            const updateFilter = res.data.map(item => ({
                physician_name: item.patient_data.first_name + ' ' + item.patient_data.middle_name + ' ' + item.patient_data.first_lastname + ' ' + item.patient_data.second_lastname,
                reason: item.reason,
                doctor_name: item.personal_data.first_name + ' ' + item.personal_data.middle_name + ' ' + item.personal_data.first_lastname + ' ' + item.personal_data.second_lastname,
                date: formatDate(item.datetime)
            }));
            setMedicalAppointments(updateFilter);
        } catch {
            sweetToast('error', 'Ha ocurrido un error inesperado al obtener lista de citas médicas');
        }
    }

    return (
        <ReportsContext.Provider value={{ medicalAppointments }}>
            <div className="flex flex-col w-full gap-y-2">
                <div className="flex flex-rows gap-2 flex-wrap md:flex-nowrap">
                    <Select
                        label="Seleccione un Reporte"
                        className={clsx(selectedReport === ListReports.Treatment || selectedReport === ListReports.MedicalAppointments ? "md:w-1/2" : "md:w-1/4")}
                        defaultSelectedKeys={[ListReports.PaymentControl.toString()]}
                        onChange={(e) => {

                            if (e.target.value === '1') {
                                setSelectedReport(Number(ListReports.Treatment));
                            } else if ((e.target.value === '2')) {
                                setSelectedReport(Number(ListReports.PaymentControl));
                            } else if ((e.target.value === '3')) {
                                setSelectedReport(Number(ListReports.MedicalAppointments));
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
                        className="md:w-1/4 w-full"
                        defaultValue={{
                            start: parseDate("2025-01-01"),
                            end: parseDate("2025-12-31"),
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

                    <Button
                        onClick={() => {
                            selectedReport === ListReports.Treatment
                                ? downloadReportTrataments()
                                : selectedReport === ListReports.PaymentControl
                                    ? downloadReportPayments()
                                    : downloadReportMedicalAppointments()
                        }}
                        className={clsx("text-lg h-[55px] bg-primary w-full text-white font-bold", selectedReport === ListReports.Treatment || selectedReport === ListReports.MedicalAppointments ? "md:w-1/2" : "md:w-1/4")}>
                        EXCEL
                        <ArrowDownTrayIcon className="size-5" />
                    </Button>
                    {selectedReport === ListReports.PaymentControl && (
                        <Button
                            className={clsx("rounded-lg text-lg w-full h-[55px] bg-[#2c79dd] text-white font-bold hover:bg-[#2c7ce5]", selectedReport === ListReports.MedicalAppointments ? "md:w-1/2" : "md:w-1/4")}
                            isDisabled={medicalAppointments && medicalAppointments?.length === 0}
                        > <PDFDownloadLink
                            className={clsx("rounded-xl text-lg w-full h-[55px] bg-[#2c79dd] text-white font-bold md:w-1/4 hover:bg-[#2c7ce5]")}
                            document={<Pdf data={allPayments && allPayments?.length ? allPayments : []} type="Total de Pagos" />}
                            fileName="control-de-pagos.pdf"
                        >
                                <div className="flex flex-row size-full justify-center item-center gap-2 mt-3">
                                    PDF <ArrowDownTrayIcon className="size-5 mt-1" />
                                </div>
                            </PDFDownloadLink>
                        </Button>

                    )} {selectedReport === ListReports.Treatment && (
                        <Button
                            className={clsx("rounded-lg text-lg w-full h-[55px] bg-[#2c79dd] text-white font-bold hover:bg-[#2c7ce5]", selectedReport === ListReports.Treatment ? "md:w-1/2" : "md:w-1/4")}
                            isDisabled={allTreatment && allTreatment?.length === 0}
                        >
                            <PDFDownloadLink
                                className={clsx("rounded-lg text-lg w-full h-[55px] bg-[#2c79dd] text-white font-bold hover:bg-[#2c7ce5]", selectedReport === ListReports.Treatment ? "md:w-1/2" : "md:w-1/4")}
                                document={<Pdf data={allTreatment && allTreatment?.length ? allTreatment : []} type="Tratamientos" />}
                                fileName="tratamientos.pdf"
                            >
                                <div className="flex flex-row size-full justify-center item-center gap-2 mt-3">
                                    PDF <ArrowDownTrayIcon className="size-5 mt-1" />
                                </div>
                            </PDFDownloadLink>
                        </Button>
                    )}
                    {selectedReport === ListReports.MedicalAppointments && (
                        <Button
                            className={clsx("rounded-lg text-lg w-full h-[55px] bg-[#2c79dd] text-white font-bold hover:bg-[#2c7ce5]", selectedReport === ListReports.MedicalAppointments ? "md:w-1/2" : "md:w-1/4")}
                            isDisabled={medicalAppointments && medicalAppointments?.length === 0}
                        >
                            <PDFDownloadLink
                                className={clsx("rounded-lg text-lg w-full h-[55px] bg-[#2c79dd] text-white font-bold hover:bg-[#2c7ce5]", selectedReport === ListReports.MedicalAppointments ? "md:w-1/2" : "md:w-1/4")}
                                document={<Pdf data={medicalAppointments && medicalAppointments?.length ? medicalAppointments : []} type="Tratamientos" />}
                                fileName="citas.pdf"
                            >
                                <div className="flex flex-row size-full justify-center item-center gap-2 mt-3">
                                    PDF <ArrowDownTrayIcon className="size-5 mt-1" />
                                </div>
                            </PDFDownloadLink>
                        </Button>
                    )}
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
                        ) : selectedReport === ListReports.Treatment ? (
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
                        ) : (
                            <Table
                                radius="sm"
                                shadow="none"
                                aria-label="Reports"
                                className="h-[50vh] col-span-2"
                            >
                                <TableHeader columns={columnsMedicalAppointments}>
                                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                                </TableHeader>
                                <TableBody emptyContent="No hay información para mostrar">
                                    {medicalAppointments?.length ? (
                                        medicalAppointments.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.doctor_name}</TableCell>
                                                <TableCell>{item.physician_name}</TableCell>
                                                <TableCell>{item.reason}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : null}
                                </TableBody>
                            </Table>
                        )
                    )}
                </div>

            </div>
        </ReportsContext.Provider>
    );
}
