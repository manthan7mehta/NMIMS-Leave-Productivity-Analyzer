import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { attendanceStore } from '@/lib/attendance-store';
import { processAttendanceData } from '@/lib/attendance-utils';

interface AttendanceData {
  employeeName: string;
  date: string;
  inTime: string;
  outTime: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx')) {
      return NextResponse.json({ error: 'Only .xlsx files are supported' }, { status: 400 });
    }

    // Read and parse Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    
    if (rawData.length === 0) {
      return NextResponse.json({ error: 'Excel file is empty' }, { status: 400 });
    }

    // Validate and map data structure
    const attendanceData: AttendanceData[] = rawData.map((row: any) => {
      // Handle different possible column names
      const employeeName = row['Employee Name'] || row['EmployeeName'] || row['Name'] || '';
      const date = row['Date'] || row['date'] || '';
      const inTime = row['In-Time'] || row['InTime'] || row['In Time'] || '';
      const outTime = row['Out-Time'] || row['OutTime'] || row['Out Time'] || '';

      if (!employeeName || !date) {
        throw new Error('Missing required fields: Employee Name and Date');
      }

      return {
        employeeName: employeeName.toString(),
        date: date.toString(),
        inTime: inTime.toString(),
        outTime: outTime.toString()
      };
    });

    // Process attendance data with business logic
    const processedRecords = attendanceData.map(record => {
      const processedRecord = processAttendanceData([record])[0];
      return {
        employeeName: processedRecord.employee,
        date: processedRecord.date.toISOString().split('T')[0], // Convert to string
        inTime: processedRecord.inTime ? processedRecord.inTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : null,
        outTime: processedRecord.outTime ? processedRecord.outTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : null,
        workedHours: processedRecord.workedHours,
        expectedHours: processedRecord.expectedHours,
        isLeave: processedRecord.isLeave,
        productivity: processedRecord.expectedHours > 0 ? (processedRecord.workedHours / processedRecord.expectedHours) * 100 : 0
      };
    });

    // Store processed data in memory for analytics
    attendanceStore.setData(processedRecords);
    
    // For now, just simulate processing without database
    // TODO: Add database storage when MongoDB is configured
    const employees = [...new Set(attendanceData.map((r: any) => r.employeeName))];

    return NextResponse.json({
      message: 'File processed successfully',
      recordsProcessed: attendanceData.length,
      employees: employees.length,
      employeeNames: employees,
      data: processedRecords // Include processed data for testing
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}