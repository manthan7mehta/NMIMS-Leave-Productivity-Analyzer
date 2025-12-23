export interface AttendanceData {
  employeeName: string;
  date: string;
  inTime: string;
  outTime: string;
}

export interface ProcessedAttendance {
  employee: string;
  date: Date;
  inTime: Date | null;
  outTime: Date | null;
  workedHours: number;
  expectedHours: number;
  isLeave: boolean;
}

export interface MonthlyStats {
  employeeName: string;
  totalExpectedHours: number;
  totalWorkedHours: number;
  leavesUsed: number;
  productivityPercentage: number;
  dailyBreakdown: ProcessedAttendance[];
}

/**
 * Calculate expected working hours based on the day of the week
 */
export function getExpectedHours(date: Date): number {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  if (dayOfWeek === 0) { // Sunday
    return 0;
  } else if (dayOfWeek === 6) { // Saturday
    return 4; // Half day: 10 AM to 2 PM
  } else { // Monday to Friday
    return 8.5; // 10 AM to 6:30 PM
  }
}

/**
 * Calculate worked hours from in-time and out-time
 */
export function calculateWorkedHours(inTime: Date | null, outTime: Date | null): number {
  if (!inTime || !outTime) {
    return 0;
  }
  
  const diffMs = outTime.getTime() - inTime.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return Math.max(0, diffHours);
}

/**
 * Parse time string (HH:MM) and create Date object for specific date
 */
export function parseTimeString(dateStr: string, timeStr: string): Date | null {
  if (!timeStr || timeStr.trim() === '') {
    return null;
  }
  
  try {
    const date = new Date(dateStr);
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return null;
    }
    
    date.setHours(hours, minutes, 0, 0);
    return date;
  } catch (error) {
    return null;
  }
}

/**
 * Process attendance data and calculate metrics
 */
export function processAttendanceData(data: AttendanceData[]): ProcessedAttendance[] {
  return data.map(record => {
    const date = new Date(record.date);
    const inTime = parseTimeString(record.date, record.inTime);
    const outTime = parseTimeString(record.date, record.outTime);
    
    const expectedHours = getExpectedHours(date);
    const workedHours = calculateWorkedHours(inTime, outTime);
    const isLeave = expectedHours > 0 && (!inTime || !outTime);
    
    return {
      employee: record.employeeName,
      date,
      inTime,
      outTime,
      workedHours,
      expectedHours,
      isLeave
    };
  });
}

/**
 * Calculate monthly statistics for an employee
 */
export function calculateMonthlyStats(
  employeeName: string,
  attendanceData: ProcessedAttendance[],
  month: number,
  year: number
): MonthlyStats {
  // Filter data for the specific month and year
  const monthlyData = attendanceData.filter(record => {
    return record.employee === employeeName &&
           record.date.getMonth() === month &&
           record.date.getFullYear() === year;
  });
  
  const totalExpectedHours = monthlyData.reduce((sum, record) => sum + record.expectedHours, 0);
  const totalWorkedHours = monthlyData.reduce((sum, record) => sum + record.workedHours, 0);
  const leavesUsed = monthlyData.filter(record => record.isLeave).length;
  
  const productivityPercentage = totalExpectedHours > 0 
    ? (totalWorkedHours / totalExpectedHours) * 100 
    : 0;
  
  return {
    employeeName,
    totalExpectedHours,
    totalWorkedHours,
    leavesUsed,
    productivityPercentage,
    dailyBreakdown: monthlyData.sort((a, b) => a.date.getTime() - b.date.getTime())
  };
}