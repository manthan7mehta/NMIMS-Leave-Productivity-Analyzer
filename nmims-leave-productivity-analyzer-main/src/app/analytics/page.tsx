'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CombinedAnalytics {
  totalExpectedHours: number;
  totalWorkedHours: number;
  leavesUsed: number;
  productivityPercentage: number;
  employeeCount: number;
  employeeRecords: Array<{
    employeeName: string;
    date: string;
    inTime: string | null;
    outTime: string | null;
    workedHours: number;
    expectedHours: number;
    isLeave: boolean;
    productivity: number;
  }>;
  dailyBreakdown: Array<{
    date: string;
    totalWorkedHours: number;
    totalExpectedHours: number;
    employeesPresent: number;
    totalEmployees: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<CombinedAnalytics | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null); // Start with no filter
  const [selectedYear, setSelectedYear] = useState<number | null>(null); // Start with no filter
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get stored attendance data from localStorage
      const storedData = localStorage.getItem('attendanceData');
      
      let response;
      if (storedData) {
        // Send stored data to analytics API
        response = await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            month: selectedMonth, // Will be null for "All Months"
            year: selectedYear, // Will be null for "All Years"
            employee: 'ALL_EMPLOYEES',
            data: JSON.parse(storedData)
          })
        });
      } else {
        // Fallback to GET request (will show mock data)
        const params = new URLSearchParams({ employee: 'ALL_EMPLOYEES' });
        if (selectedMonth) params.append('month', selectedMonth.toString());
        if (selectedYear) params.append('year', selectedYear.toString());
        response = await fetch(`/api/analytics?${params}`);
      }
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load analytics');
      }
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Auto-load analytics when component mounts
  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
          <p className="text-lg text-gray-600 mb-6">View productivity analytics for all employees</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 underline font-medium">
            ← Back to Upload
          </Link>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-blue-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Analysis Period</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <select
                  id="month"
                  value={selectedMonth || ''}
                  onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Months</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  id="year"
                  value={selectedYear || ''}
                  onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Years</option>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <button
                  onClick={loadAnalytics}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                >
                  {loading ? 'Analyzing...' : 'Analyze All Employees'}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">⚠️ {error}</p>
              </div>
            )}
          </div>

          {analytics && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold text-xl">👥</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.employeeCount}</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-indigo-500">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-indigo-600 font-bold text-xl">⏰</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Expected Hours</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalExpectedHours?.toFixed(1)}h</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold text-xl">✓</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Actual Hours</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalWorkedHours?.toFixed(1)}h</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-yellow-600 font-bold text-xl">🏖️</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Leaves</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.leavesUsed}</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold text-xl">📊</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Productivity</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.productivityPercentage?.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Employee Records Table */}
              {analytics.employeeRecords && analytics.employeeRecords.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Employee Attendance Records</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            In Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Out Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Worked Hours
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Expected Hours
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Productivity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analytics.employeeRecords.map((record, index) => (
                          <tr key={index} className={`hover:bg-gray-50 ${record.isLeave ? 'bg-red-50' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {record.employeeName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.inTime || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.outTime || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.isLeave ? '-' : `${record.workedHours.toFixed(1)}h`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.expectedHours.toFixed(1)}h
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {record.isLeave ? (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                  Leave
                                </span>
                              ) : (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  Present
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.isLeave ? '-' : (
                                <span className={`font-medium ${
                                  record.productivity >= 90 ? 'text-green-600' :
                                  record.productivity >= 75 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {record.productivity.toFixed(1)}%
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Table Summary */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="text-center">
                      <span className="font-medium">Total Records:</span> {analytics.employeeRecords.length}
                    </div>
                    <div className="text-center">
                      <span className="font-medium">Present Days:</span> {analytics.employeeRecords.filter(r => !r.isLeave).length}
                    </div>
                    <div className="text-center">
                      <span className="font-medium">Leave Days:</span> {analytics.employeeRecords.filter(r => r.isLeave).length}
                    </div>
                    <div className="text-center">
                      <span className="font-medium">Avg Attendance:</span> {(analytics.employeeRecords.filter(r => !r.isLeave).length / analytics.employeeRecords.length * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• Upload your Excel attendance file on the home page</li>
                  <li>• Select the month and year you want to analyze</li>
                  <li>• Click "Analyze All Employees" to see combined statistics</li>
                  <li>• View productivity metrics for all uploaded employee data</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}