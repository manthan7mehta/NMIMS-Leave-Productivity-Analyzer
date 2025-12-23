// Simple in-memory data store for uploaded attendance data
// In production, this would be replaced with database operations

interface ProcessedAttendanceRecord {
  employeeName: string;
  date: string;
  inTime: string | null;
  outTime: string | null;
  workedHours: number;
  expectedHours: number;
  isLeave: boolean;
  productivity: number;
}

class AttendanceDataStore {
  private data: ProcessedAttendanceRecord[] = [];
  
  setData(records: ProcessedAttendanceRecord[]) {
    this.data = records;
  }
  
  getData(): ProcessedAttendanceRecord[] {
    return this.data;
  }
  
  getEmployees(): string[] {
    return [...new Set(this.data.map(record => record.employeeName))];
  }
  
  clearData() {
    this.data = [];
  }
}

// Export singleton instance
export const attendanceStore = new AttendanceDataStore();