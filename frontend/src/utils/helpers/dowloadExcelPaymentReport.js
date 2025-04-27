import ExcelJS from 'exceljs';

export const formatCurrency = (value) => {
  return value.toLocaleString('es-NI', {
      style: 'currency',
      currency: 'NIO',
      minimumFractionDigits: 2
  });
}

export async function dowloadExcelPaymentReport(data, fileName) {
  if (!data.length) {
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);
  

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1F497D' },
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  data.forEach((item) => {
    worksheet.addRow(Object.values(item));
  });

  let total = 0;
  for(const row of data){
    const value = row['Total'];
    if(typeof value === 'string'){
      const numeric = Number(value.replace(/L|\$|C\$|\s|,/g, ''));
      if(!isNaN(numeric)){
        total += numeric;
      }
    }
  }
  let totalPaid = 0;
  for(const row of data){
    const value = row['Abonado'];
    if(typeof value === 'string'){
      const numeric = Number(value.replace(/L|\$|C\$|\s|,/g, ''));
      if(!isNaN(numeric)){
        totalPaid += numeric;
      }
    }
  }

  let totalSlope = 0;
  for(const row of data){
    const value = row['Restante'];
    if(typeof value === 'string'){
      const numeric = Number(value.replace(/L|\$|C\$|\s|,/g, ''));
      if(!isNaN(numeric)){
        totalSlope += numeric;
      }
    }
  }
  const lastRowIndex = worksheet.lastRow?.number ?? data.length + 1;
  const frontRow = worksheet.getRow(lastRowIndex + 1);
  const totalCells = ['A', 'E', 'F', 'G'];

  const fillStyle = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9E1F2' },
  };

  frontRow.getCell('A').value = 'TOTAL';
  frontRow.getCell('E').value = formatCurrency(total);
  frontRow.getCell('F').value = formatCurrency(totalPaid);
  frontRow.getCell('G').value = formatCurrency(totalSlope);

  for (const col of totalCells) {
    frontRow.getCell(col).font = { bold: true };
    frontRow.getCell(col).fill = fillStyle;
  }

  frontRow.commit();

  worksheet.columns.forEach((column) => {
    column.width = 20;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.xlsx`;
  link.click();
  URL.revokeObjectURL(link.href);
}
