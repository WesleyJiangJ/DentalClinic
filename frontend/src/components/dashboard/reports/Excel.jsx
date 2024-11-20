import * as XLSX from 'xlsx';
import { formatCurrency } from './Reports';
export const generateExcel = (headers, data) => {
    const workbook = XLSX.utils.book_new();

    const worksheetData = [
        headers,
        ...data.map(item => [
            `${item.first_name} ${item.first_lastname}`,
            item.description,
            new Date(item.created_at).toLocaleString("en-US"),
            formatCurrency(Number(item.total)),
            formatCurrency(item.totalPaid),
            formatCurrency(item.totalSlope)
        ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    XLSX.writeFile(workbook, 'reporte.xlsx');
};



