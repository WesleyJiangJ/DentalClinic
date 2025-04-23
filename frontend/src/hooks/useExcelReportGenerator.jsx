
import { downloadExcelFile } from "../utils/helpers/download-excel";
const useExcelReportGenerator = (allTreatment, medicalAppointments, allPayments) => {
  const downloadReportTrataments = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const currentDate = day + '-' + month + '-' + year;
    const excelList = allTreatment.map((item) => ({
      "Nombre": item.name,
      "Descripción": item.description,
      "Precio": item.price
    }));
    downloadExcelFile(excelList, "tratamientos-" + currentDate);
  }

  const downloadReportPayments = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const currentDate = day + '-' + month + '-' + year;
    const excelList = allPayments.map((item) => ({
      "Nombre": item.first_name,
      "Apellido": item.first_lastname,
      "Descripción": item.description,
      "Fecha": item.created_at,
      "Total": item.total,
      "Abonado": item.totalPaid,
      "Restante": item.totalSlope
    }));
    downloadExcelFile(excelList, "pagos-" + currentDate);
  }

  const downloadReportMedicalAppointments = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const currentDate = day + '-' + month + '-' + year;
    const excelList = medicalAppointments.map((item) => ({
      "Doctor": item.doctor_name,
      "Paciente": item.physician_name,
      "Razón": item.reason,
      "Fecha": item.date,
    }));
    downloadExcelFile(excelList, "citas-" + currentDate);
  }
  return { downloadReportTrataments, downloadReportPayments, downloadReportMedicalAppointments };
};

export default useExcelReportGenerator;
