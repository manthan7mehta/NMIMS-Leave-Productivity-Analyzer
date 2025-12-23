import { NextRequest, NextResponse } from 'next/server';
import { attendanceStore } from '@/lib/attendance-store';

// Mock data for testing without database
const mockEmployees = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' }
];

const mockAnalytics = {
  employeeName: 'John Doe',
  totalExpectedHours: 170.0,
  totalWorkedHours: 158.5,
  leavesUsed: 1,
  productivityPercentage: 93.2,
  dailyBreakdown: [
    {
      date: new Date('2024-01-01'),
      inTime: new Date('2024-01-01T10:00:00'),
      outTime: new Date('2024-01-01T18:30:00'),
      workedHours: 8.5,
      expectedHours: 8.5,
      isLeave: false
    },
    {
      date: new Date('2024-01-02'),
      inTime: new Date('2024-01-02T10:15:00'),
      outTime: new Date('2024-01-02T18:45:00'),
      workedHours: 8.5,
      expectedHours: 8.5,
      isLeave: false
    },
    {
      date: new Date('2024-01-03'),
      inTime: new Date('2024-01-03T10:30:00'),
      outTime: new Date('2024-01-03T18:20:00'),
      workedHours: 7.8,
      expectedHours: 8.5,
      isLeave: false
    },
    {
      date: new Date('2024-01-10'),
      inTime: null,
      outTime: null,
      workedHours: 0,
      expectedHours: 8.5,
      isLeave: true
    }
  ]
};

const mockAllEmployeesAnalytics = {
  employeeName: 'All Employees',
  totalExpectedHours: 340.0,
  totalWorkedHours: 315.8,
  leavesUsed: 3,
  productivityPercentage: 92.9,
  employeeCount: mockEmployees.length, // Dynamic count based on mock employees
  employeeRecords: [
    {
      employeeName: 'John Doe',
      date: '2024-01-01',
      inTime: '10:00 AM',
      outTime: '6:30 PM',
      workedHours: 8.5,
      expectedHours: 8.5,
      isLeave: false,
      productivity: 100.0
    },
    {
      employeeName: 'Jane Smith',
      date: '2024-01-01',
      inTime: '9:45 AM',
      outTime: '6:15 PM',
      workedHours: 8.5,
      expectedHours: 8.5,
      isLeave: false,
      productivity: 100.0
    },
    {
      employeeName: 'John Doe',
      date: '2024-01-02',
      inTime: '10:15 AM',
      outTime: '6:45 PM',
      workedHours: 8.5,
      expectedHours: 8.5,
      isLeave: false,
      productivity: 100.0
    },
    {
      employeeName: 'Jane Smith',
      date: '2024-01-02',
      inTime: '10:30 AM',
      outTime: '6:45 PM',
      workedHours: 8.25,
      expectedHours: 8.5,
      isLeave: false,
      productivity: 97.1
    },
    {
      employeeName: 'John Doe',
      date: '2024-01-03',
      inTime: '10:30 AM',
      outTime: '6:20 PM',
      workedHours: 7.8,
      expectedHours: 8.5,
      isLeave: false,
      productivity: 91.8
    },
    {
      employeeName: 'Jane Smith',
      date: '2024-01-03',
      inTime: '10:00 AM',
      outTime: '6:30 PM',
      workedHours: 8.5,
      expectedHours: 8.5,
      isLeave: false,
      productivity: 100.0
    },
    {
      employeeName: 'John Doe',
      date: '2024-01-04',
      inTime: null,
      outTime: null,
      workedHours: 0,
      expectedHours: 8.5,
      isLeave: true,
      productivity: 0
    },
    {
      employeeName: 'Jane Smith',
      date: '2024-01-05',
      inTime: null,
      outTime: null,
      workedHours: 0,
      expectedHours: 8.5,
      isLeave: true,
      productivity: 0
    },
    {
      employeeName: 'John Doe',
      date: '2024-01-05',
      inTime: '9:50 AM',
      outTime: '6:25 PM',
      workedHours: 8.6,
      expectedHours: 8.5,
      isLeave: false,
      productivity: 101.2
    },
    {
      employeeName: 'Jane Smith',
      date: '2024-01-08',
      inTime: '10:10 AM',
      outTime: '6:40 PM',
      workedHours: 8.5,
      expectedHours: 8.5,
      isLeave: false,
      productivity: 100.0
    }
  ],
  dailyBreakdown: [
    {
      date: '2024-01-01',
      totalWorkedHours: 17.0,
      totalExpectedHours: 17.0,
      employeesPresent: 2,
      totalEmployees: mockEmployees.length
    },
    {
      date: '2024-01-02',
      totalWorkedHours: 16.75,
      totalExpectedHours: 17.0,
      employeesPresent: 2,
      totalEmployees: mockEmployees.length
    },
    {
      date: '2024-01-03',
      totalWorkedHours: 16.3,
      totalExpectedHours: 17.0,
      employeesPresent: 2,
      totalEmployees: mockEmployees.length
    },
    {
      date: '2024-01-04',
      totalWorkedHours: 0,
      totalExpectedHours: 8.5,
      employeesPresent: 0,
      totalEmployees: mockEmployees.length
    },
    {
      date: '2024-01-05',
      totalWorkedHours: 8.6,
      totalExpectedHours: 17.0,
      employeesPresent: 1,
      totalEmployees: mockEmployees.length
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeName = searchParams.get('employee');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!employeeName) {
      return NextResponse.json({ error: 'Employee name is required' }, { status: 400 });
    }

    // Get stored attendance data
    const storedData = attendanceStore.getData();
    
    // If no data uploaded, return mock data
    if (storedData.length === 0) {
      if (employeeName === 'ALL_EMPLOYEES') {
        return NextResponse.json(mockAllEmployeesAnalytics);
      }
      return NextResponse.json({ ...mockAnalytics, employeeName });
    }

    // Filter data by month/year if provided
    let filteredData = storedData;
    if (month && year) {
      filteredData = storedData.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() + 1 === parseInt(month) && 
               recordDate.getFullYear() === parseInt(year);
      });
    } else if (month) {
      filteredData = storedData.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() + 1 === parseInt(month);
      });
    } else if (year) {
      filteredData = storedData.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getFullYear() === parseInt(year);
      });
    }
    // If no month/year provided, use all data

    // Calculate analytics from real data
    const allEmployees = new Set(storedData.map(record => record.employeeName)); // Total employees across all data
    const totalExpectedHours = filteredData.reduce((sum, record) => sum + record.expectedHours, 0);
    const totalWorkedHours = filteredData.reduce((sum, record) => sum + record.workedHours, 0);
    const leavesUsed = filteredData.filter(record => record.isLeave).length;
    const productivityPercentage = totalExpectedHours > 0 ? (totalWorkedHours / totalExpectedHours) * 100 : 0;
    const employeeCount = new Set(filteredData.map(record => record.employeeName)).size;

    // Create daily breakdown
    const dailyBreakdown = Object.values(
      filteredData.reduce((acc: any, record) => {
        const dateKey = record.date;
        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: dateKey,
            totalWorkedHours: 0,
            totalExpectedHours: 0,
            employeesPresent: 0,
            totalEmployees: allEmployees.size, // Use total unique employees from all data
            presentEmployees: new Set()
          };
        }
        acc[dateKey].totalWorkedHours += record.workedHours;
        acc[dateKey].totalExpectedHours += record.expectedHours;
        if (!record.isLeave) {
          acc[dateKey].presentEmployees.add(record.employeeName);
        }
        return acc;
      }, {})
    ).map((day: any) => ({
      date: day.date,
      totalWorkedHours: day.totalWorkedHours,
      totalExpectedHours: day.totalExpectedHours,
      employeesPresent: day.presentEmployees.size,
      totalEmployees: day.totalEmployees
    }));

    const analytics = {
      employeeName: 'All Employees',
      totalExpectedHours,
      totalWorkedHours,
      leavesUsed,
      productivityPercentage,
      employeeCount: allEmployees.size, // Use total unique employees from all data
      employeeRecords: filteredData,
      dailyBreakdown
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is analytics request with data
    if (body.data && Array.isArray(body.data)) {
      const { month, year, data } = body;
      
      // Filter data by month/year if provided
      let filteredData = data;
      if (month && year) {
        filteredData = data.filter((record: any) => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() + 1 === parseInt(month.toString()) && 
                 recordDate.getFullYear() === parseInt(year.toString());
        });
      } else if (month) {
        filteredData = data.filter((record: any) => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() + 1 === parseInt(month.toString());
        });
      } else if (year) {
        filteredData = data.filter((record: any) => {
          const recordDate = new Date(record.date);
          return recordDate.getFullYear() === parseInt(year.toString());
        });
      }
      // If no month/year provided, use all data

      // Calculate analytics from real data
      const totalExpectedHours = filteredData.reduce((sum: number, record: any) => sum + record.expectedHours, 0);
      const totalWorkedHours = filteredData.reduce((sum: number, record: any) => sum + record.workedHours, 0);
      const leavesUsed = filteredData.filter((record: any) => record.isLeave).length;
      const productivityPercentage = totalExpectedHours > 0 ? (totalWorkedHours / totalExpectedHours) * 100 : 0;
      const allEmployees = new Set(data.map((record: any) => record.employeeName)); // Total employees across all data
      const employeeCount = new Set(filteredData.map((record: any) => record.employeeName)).size;

      // Create daily breakdown
      const dailyBreakdown = Object.values(
        filteredData.reduce((acc: any, record: any) => {
          const dateKey = record.date;
          if (!acc[dateKey]) {
            acc[dateKey] = {
              date: dateKey,
              totalWorkedHours: 0,
              totalExpectedHours: 0,
              employeesPresent: 0,
              totalEmployees: allEmployees.size, // Use total unique employees from all data
              presentEmployees: new Set()
            };
          }
          acc[dateKey].totalWorkedHours += record.workedHours;
          acc[dateKey].totalExpectedHours += record.expectedHours;
          if (!record.isLeave) {
            acc[dateKey].presentEmployees.add(record.employeeName);
          }
          return acc;
        }, {})
      ).map((day: any) => ({
        date: day.date,
        totalWorkedHours: day.totalWorkedHours,
        totalExpectedHours: day.totalExpectedHours,
        employeesPresent: day.presentEmployees.size,
        totalEmployees: day.totalEmployees
      }));

      const analytics = {
        employeeName: 'All Employees',
        totalExpectedHours,
        totalWorkedHours,
        leavesUsed,
        productivityPercentage,
        employeeCount: allEmployees.size, // Use total unique employees from all data
        employeeRecords: filteredData,
        dailyBreakdown
      };

      return NextResponse.json(analytics);
    }
    
    // Return employees from stored data if available (original POST functionality)
    const storedData = attendanceStore.getData();
    if (storedData.length > 0) {
      const employees = attendanceStore.getEmployees().map((name, index) => ({
        id: (index + 1).toString(),
        name: name
      }));
      return NextResponse.json(employees);
    }
    
    // Return mock employees if no data uploaded
    return NextResponse.json(mockEmployees);

  } catch (error) {
    console.error('Error in POST analytics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}