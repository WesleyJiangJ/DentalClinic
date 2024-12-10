import * as XLSX from 'xlsx';

export const generateExcel = (headers, data, keys) => {
    const workbook = XLSX.utils.book_new();

    const worksheetData = [
        headers,
        ...data.map(item => keys.map(key => item[key] || ''))
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const columnWidths = headers.map((header, index) => ({
        wch: Math.max(
            header.length,
            ...data.map(item => (item[keys[index]] ? item[keys[index]].toString().length : 0))
        )
    }));
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    XLSX.writeFile(workbook, 'reporte.xlsx');
};
