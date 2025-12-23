# NMIMS Leave & Productivity Analyzer

A full-stack web application built with Next.js that analyzes employee attendance, leave usage, and productivity based on uploaded Excel attendance sheets.
Live demo :https://leave-productivity-analyzer-seven.vercel.app/
## 🚀 Features 

- **Excel File Upload**: Accept .xlsx files with employee attendance data
- **Data Processing**: Parse Excel, calculate worked hours, identify leaves, store in database
- **Dashboard**: Display total expected hours, actual worked hours, leaves used (out of 2), productivity percentage
- **Monthly Analysis**: Select month and view monthly summary with daily breakdown
- **Responsive Design**: Clean, mobile-friendly interface built with Tailwind CSS

## 📋 Business Rules

### Working Hours
- **Monday to Friday**: 8.5 hours per day (10:00 AM to 6:30 PM)
- **Saturday**: 4 hours (half day from 10:00 AM to 2:00 PM)
- **Sunday**: Off (no working hours expected)

### Leave Policy
- Each employee is allowed **2 leaves per month**
- Missing attendance on a working day (Monday-Saturday) is marked as a leave

### Productivity Calculation
```
Productivity = (Actual Worked Hours / Expected Working Hours) × 100
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.x with React
- **Styling**: Tailwind CSS 4.x
- **Database**: MongoDB with Prisma ORM
- **Language**: TypeScript (TSX)
- **Excel Processing**: xlsx library
- **Deployment**: Ready for Vercel/Netlify

## 📁 Project Structure

```
nmims-leave-productivity-analyzer/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics/     # Analytics API endpoints
│   │   │   └── upload/        # File upload API
│   │   ├── layout.tsx         # App layout
│   │   └── page.tsx           # Home page
│   └── lib/
│       ├── attendance-utils.ts # Utility functions
│       └── prisma.ts          # Prisma client
├── sample-data/
│   └── attendance-sample.xlsx # Sample Excel file
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nmims-leave-productivity-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## ✅ Current Status (Working Features)

### 🔧 **Frontend Interface**
- ✅ **File Upload Interface**: Interactive drag-and-drop zone for Excel files
- ✅ **Upload Processing**: Real-time feedback and error handling
- ✅ **Analytics Dashboard**: Complete UI for viewing productivity reports
- ✅ **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### 📊 **API Endpoints**
- ✅ **POST /api/upload**: Excel file parsing and validation (without database storage)
- ✅ **GET /api/analytics**: Mock analytics data for testing
- ✅ **POST /api/analytics**: Mock employee list for dropdown

### 🧪 **Testing Ready**
- ✅ **Sample Excel File**: Ready-to-use test data in `/sample-data/attendance-sample.xlsx`
- ✅ **Mock Data**: Analytics page shows sample productivity reports
- ✅ **Error Handling**: Proper error messages and validation

## 🔄 **Next Steps for Full Implementation**

To complete the application with database functionality:

1. **Setup MongoDB**: Update `.env` with real MongoDB connection string
2. **Enable Prisma**: Uncomment database operations in API routes
3. **Database Migration**: Run `npx prisma db push` to create tables
4. **Real Data Processing**: Enable the attendance calculation utilities

## 🎯 **How to Test Current Version**

1. **Upload Excel File**: 
   - Go to http://localhost:3000
   - Click "Choose File" and select `/sample-data/attendance-sample.xlsx`
   - Click "Upload & Process" to see file parsing results

2. **View Analytics**: 
   - Click "View Analytics Dashboard" 
   - Select "John Doe" or "Jane Smith" from dropdown
   - Click "Analyze" to see mock productivity reports

3. **Sample Data Format**:
   The Excel file includes columns: Employee Name, Date, In-Time, Out-Time

## 📊 Excel File Format

Your Excel file should have the following columns:

| Employee Name | Date       | In-Time | Out-Time |
|---------------|------------|---------|----------|
| John Doe      | 2024-01-01 | 10:00   | 18:30    |
| John Doe      | 2024-01-02 | 10:15   | 18:45    |
| John Doe      | 2024-01-03 |         |          |

**Note**: Missing in-time/out-time will be treated as a leave day.

## 📱 Usage

1. **Upload Excel File**: Click on the upload area and select your .xlsx attendance file
2. **View Analytics**: After upload, navigate to the analytics dashboard
3. **Select Employee & Month**: Choose an employee and month to view detailed statistics
4. **Review Metrics**: View productivity percentage, leave usage, and daily breakdown

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📊 Database Schema

The application uses MongoDB with two main collections:

### Employee
- `id`: Unique identifier
- `name`: Employee name
- `employeeId`: Optional unique employee ID

### AttendanceRecord
- `employeeId`: Reference to employee
- `date`: Date of attendance
- `inTime`: Clock-in time (nullable)
- `outTime`: Clock-out time (nullable)
- `workedHours`: Calculated worked hours
- `expectedHours`: Expected hours for that day
- `isLeave`: Boolean indicating if it's a leave day

## 🚀 Deployment

### Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Add environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is created for NMIMS Intern Technical Assignment.

## 👨‍💻 Author

Built By Gaurav Sonigra (B.Tech IT)


