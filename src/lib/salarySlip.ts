// lib/salarySlip.ts
import { PDFDocument, StandardFonts } from "pdf-lib";

export async function generateSalarySlip(payroll: any, employee: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = 750;

  const draw = (text: string) => {
    page.drawText(text, { x: 50, y, size: 12, font });
    y -= 25;
  };

  draw("Salary Slip");
  draw("--------------------------");
  draw(`Employee Name: ${employee.fullName}`);
  draw(`Month: ${payroll.month}`);
  draw(`Basic Salary: ₹${payroll.basicSalary}`);
  draw(`Allowances: ₹${payroll.allowances}`);
  draw(`Deductions: ₹${payroll.deductions}`);
  draw(`Net Salary: ₹${payroll.netSalary}`);

  return await pdfDoc.save();
}
