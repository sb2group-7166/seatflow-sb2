import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// Ensure reports directory exists
const reportsDir = path.join(__dirname, '../../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

export async function generatePDF(report: any): Promise<string> {
  const doc = new PDFDocument();
  const fileName = `report-${report._id}-${Date.now()}.pdf`;
  const filePath = path.join(reportsDir, fileName);

  // Create write stream
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Add content
  doc.fontSize(20).text(report.title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(report.description);
  doc.moveDown();

  // Add report data
  if (report.type === 'revenue') {
    generateRevenuePDF(doc, report.data);
  } else if (report.type === 'attendance') {
    generateAttendancePDF(doc, report.data);
  } else if (report.type === 'activity') {
    generateActivityPDF(doc, report.data);
  }

  // Finalize PDF
  doc.end();

  // Wait for stream to finish
  await new Promise((resolve) => stream.on('finish', resolve));

  return `/reports/${fileName}`;
}

export async function generateExcel(report: any): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(report.title);
  const fileName = `report-${report._id}-${Date.now()}.xlsx`;
  const filePath = path.join(reportsDir, fileName);

  // Add data based on report type
  if (report.type === 'revenue') {
    generateRevenueExcel(worksheet, report.data);
  } else if (report.type === 'attendance') {
    generateAttendanceExcel(worksheet, report.data);
  } else if (report.type === 'activity') {
    generateActivityExcel(worksheet, report.data);
  }

  // Save workbook
  await workbook.xlsx.writeFile(filePath);

  return `/reports/${fileName}`;
}

export async function generateCSV(report: any): Promise<string> {
  const fileName = `report-${report._id}-${Date.now()}.csv`;
  const filePath = path.join(reportsDir, fileName);
  let csvContent = '';

  // Generate CSV content based on report type
  if (report.type === 'revenue') {
    csvContent = generateRevenueCSV(report.data);
  } else if (report.type === 'attendance') {
    csvContent = generateAttendanceCSV(report.data);
  } else if (report.type === 'activity') {
    csvContent = generateActivityCSV(report.data);
  }

  // Write CSV file
  await writeFileAsync(filePath, csvContent);

  return `/reports/${fileName}`;
}

// Helper functions for PDF generation
function generateRevenuePDF(doc: PDFKit.PDFDocument, data: any[]) {
  doc.fontSize(14).text('Revenue Report');
  doc.moveDown();

  // Table header
  doc.font('Helvetica-Bold');
  doc.text('Date', 50, doc.y);
  doc.text('Total Amount', 200, doc.y);
  doc.text('Transactions', 350, doc.y);
  doc.moveDown();

  // Table rows
  doc.font('Helvetica');
  data.forEach(item => {
    doc.text(item._id, 50, doc.y);
    doc.text(item.totalAmount.toString(), 200, doc.y);
    doc.text(item.count.toString(), 350, doc.y);
    doc.moveDown();
  });
}

function generateAttendancePDF(doc: PDFKit.PDFDocument, data: any[]) {
  doc.fontSize(14).text('Attendance Report');
  doc.moveDown();

  // Table header
  doc.font('Helvetica-Bold');
  doc.text('Name', 50, doc.y);
  doc.text('Email', 200, doc.y);
  doc.text('Total Shifts', 350, doc.y);
  doc.text('Completed', 450, doc.y);
  doc.text('Rate %', 550, doc.y);
  doc.moveDown();

  // Table rows
  doc.font('Helvetica');
  data.forEach(item => {
    doc.text(item.name, 50, doc.y);
    doc.text(item.email, 200, doc.y);
    doc.text(item.totalShifts.toString(), 350, doc.y);
    doc.text(item.completedShifts.toString(), 450, doc.y);
    doc.text(item.attendanceRate.toFixed(2), 550, doc.y);
    doc.moveDown();
  });
}

function generateActivityPDF(doc: PDFKit.PDFDocument, data: any[]) {
  doc.fontSize(14).text('Activity Report');
  doc.moveDown();

  data.forEach(item => {
    doc.font('Helvetica-Bold').text(item._id);
    doc.moveDown();
    doc.font('Helvetica');
    item.statuses.forEach((status: any) => {
      doc.text(`${status.status}: ${status.count}`, { indent: 20 });
    });
    doc.text(`Total: ${item.total}`, { indent: 20 });
    doc.moveDown();
  });
}

// Helper functions for Excel generation
function generateRevenueExcel(worksheet: ExcelJS.Worksheet, data: any[]) {
  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Total Amount', key: 'amount', width: 15 },
    { header: 'Transactions', key: 'count', width: 15 }
  ];

  data.forEach(item => {
    worksheet.addRow({
      date: item._id,
      amount: item.totalAmount,
      count: item.count
    });
  });
}

function generateAttendanceExcel(worksheet: ExcelJS.Worksheet, data: any[]) {
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Total Shifts', key: 'total', width: 15 },
    { header: 'Completed', key: 'completed', width: 15 },
    { header: 'Rate %', key: 'rate', width: 15 }
  ];

  data.forEach(item => {
    worksheet.addRow({
      name: item.name,
      email: item.email,
      total: item.totalShifts,
      completed: item.completedShifts,
      rate: item.attendanceRate
    });
  });
}

function generateActivityExcel(worksheet: ExcelJS.Worksheet, data: any[]) {
  worksheet.columns = [
    { header: 'Type', key: 'type', width: 20 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Count', key: 'count', width: 15 },
    { header: 'Total', key: 'total', width: 15 }
  ];

  data.forEach(item => {
    item.statuses.forEach((status: any) => {
      worksheet.addRow({
        type: item._id,
        status: status.status,
        count: status.count,
        total: item.total
      });
    });
  });
}

// Helper functions for CSV generation
function generateRevenueCSV(data: any[]): string {
  let csv = 'Date,Total Amount,Transactions\n';
  data.forEach(item => {
    csv += `${item._id},${item.totalAmount},${item.count}\n`;
  });
  return csv;
}

function generateAttendanceCSV(data: any[]): string {
  let csv = 'Name,Email,Total Shifts,Completed,Rate %\n';
  data.forEach(item => {
    csv += `${item.name},${item.email},${item.totalShifts},${item.completedShifts},${item.attendanceRate}\n`;
  });
  return csv;
}

function generateActivityCSV(data: any[]): string {
  let csv = 'Type,Status,Count,Total\n';
  data.forEach(item => {
    item.statuses.forEach((status: any) => {
      csv += `${item._id},${status.status},${status.count},${item.total}\n`;
    });
  });
  return csv;
} 