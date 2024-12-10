import { useState, useEffect } from "react";
import { getAllPaymentControl, getAllPayment } from "../api/apiFunctions";
import { formatCurrency } from "../components/dashboard/reports/Reports";

const useAllPayment = (reportingDates, setIsLoadingReport) => {
    const [allPayments, setAllPayments] = useState([]);

    useEffect(() => {
        if (reportingDates) {
            const fetchPayments = async () => {
                setIsLoadingReport(true);
                try {
                    const res = await getAllPayment();
                    const resControl = (await getAllPaymentControl()).data;

                    const payments = res.data.map((payment) => {
                        const {
                            id,
                            created_at,
                            budget_data: { patient_data: { first_lastname, first_name }, description, total = 0 } = {},
                        } = payment;

                        return { id, description, total, first_lastname, first_name, created_at };
                    });

                    const addPaymentControl = payments.map((payment) => {
                        const paymentControl = resControl.filter((control) => control.id_payment === payment.id);
                        return {
                            ...payment,
                            totalPaid: paymentControl.reduce((acc, field) => acc + parseFloat(field.paid), 0),
                            totalSlope: Number(payment.total) - paymentControl.reduce((acc, field) => acc + parseFloat(field.paid), 0),
                        };
                    });

                    const filterDate = addPaymentControl.filter((item) => {
                        const itemDate = item.created_at.substring(0, 10);
                        return itemDate >= reportingDates.startDate && itemDate <= reportingDates.endDate;
                    });

                    const updateFilter = filterDate.map((item) => ({
                        ...item,
                        created_at: new Date(item.created_at).toLocaleString("en-US"),
                        totalPaid: formatCurrency(Number(item.totalPaid)),
                        totalSlope: formatCurrency(Number(item.totalSlope)),
                        total: formatCurrency(Number(item.total)),
                    }));

                    setAllPayments(updateFilter);
                } catch (error) {
                    sweetToast("error", "Ha ocurrido un error inesperado al obtener lista de control de pagos");
                } finally {
                    setIsLoadingReport(false);
                }
            };

            fetchPayments();
        }

    }, [reportingDates]);

    return { allPayments };
};

export default useAllPayment;
