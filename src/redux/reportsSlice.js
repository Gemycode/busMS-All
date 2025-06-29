import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for reports operations
export const fetchReportData = createAsyncThunk(
  'reports/fetchData',
  async ({ period, reportType }, { rejectWithValue }) => {
    try {
      // Simulate API call for report data
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            period,
            reportType,
            data: {
              overview: {
                totalTrips: 1247,
                totalDistance: 15680,
                totalPassengers: 45230,
                avgSpeed: 28.5,
                onTimePercentage: 94.2,
                fuelConsumption: 2340,
                maintenanceAlerts: 3,
                revenue: 0
              },
              performance: {
                daily: [
                  { day: "Mon", trips: 45, passengers: 1200, avgSpeed: 26 },
                  { day: "Tue", trips: 52, passengers: 1350, avgSpeed: 28 },
                  { day: "Wed", trips: 48, passengers: 1280, avgSpeed: 27 },
                  { day: "Thu", trips: 55, passengers: 1420, avgSpeed: 29 },
                  { day: "Fri", trips: 50, passengers: 1300, avgSpeed: 28 },
                  { day: "Sat", trips: 35, passengers: 900, avgSpeed: 25 },
                  { day: "Sun", trips: 25, passengers: 650, avgSpeed: 24 }
                ],
                routes: [
                  { name: "Route A", efficiency: 96, passengers: 8500, trips: 180 },
                  { name: "Route B", efficiency: 92, passengers: 7200, trips: 165 },
                  { name: "Route C", efficiency: 94, passengers: 6800, trips: 155 }
                ]
              },
              analytics: {
                peakHours: [
                  { hour: "6-8 AM", passengers: 8500, trips: 45 },
                  { hour: "8-10 AM", passengers: 7200, trips: 38 },
                  { hour: "2-4 PM", passengers: 6800, trips: 42 },
                  { hour: "4-6 PM", passengers: 9200, trips: 48 }
                ],
                busUtilization: [
                  { bus: "BUS-001", utilization: 87, trips: 45, passengers: 1200 },
                  { bus: "BUS-002", utilization: 92, trips: 52, passengers: 1350 },
                  { bus: "BUS-003", utilization: 78, trips: 38, passengers: 980 }
                ]
              }
            }
          });
        }, 1000);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const exportReport = createAsyncThunk(
  'reports/export',
  async ({ reportType, format }, { rejectWithValue }) => {
    try {
      // Simulate API call to export report
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            downloadUrl: `/api/reports/export/${reportType}.${format}`,
            filename: `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`
          });
        }, 2000);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentPeriod: 'week',
  currentReport: 'overview',
  reportData: null,
  isLoading: false,
  error: null,
  exportStatus: {
    isExporting: false,
    success: false,
    error: null
  },
  filters: {
    dateRange: null,
    routes: [],
    buses: [],
    drivers: []
  }
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setCurrentPeriod: (state, action) => {
      state.currentPeriod = action.payload;
    },
    setCurrentReport: (state, action) => {
      state.currentReport = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        dateRange: null,
        routes: [],
        buses: [],
        drivers: []
      };
    },
    resetExportStatus: (state) => {
      state.exportStatus = {
        isExporting: false,
        success: false,
        error: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch report data
      .addCase(fetchReportData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReportData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reportData = action.payload.data;
        state.currentPeriod = action.payload.period;
        state.currentReport = action.payload.reportType;
      })
      .addCase(fetchReportData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Export report
      .addCase(exportReport.pending, (state) => {
        state.exportStatus.isExporting = true;
        state.exportStatus.success = false;
        state.exportStatus.error = null;
      })
      .addCase(exportReport.fulfilled, (state, action) => {
        state.exportStatus.isExporting = false;
        state.exportStatus.success = true;
        // Simulate download
        if (action.payload.downloadUrl) {
          const link = document.createElement('a');
          link.href = action.payload.downloadUrl;
          link.download = action.payload.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .addCase(exportReport.rejected, (state, action) => {
        state.exportStatus.isExporting = false;
        state.exportStatus.error = action.payload;
      });
  }
});

// Export actions
export const {
  setCurrentPeriod,
  setCurrentReport,
  setFilters,
  clearFilters,
  resetExportStatus
} = reportsSlice.actions;

// Export selectors
export const selectCurrentPeriod = (state) => state.reports.currentPeriod;
export const selectCurrentReport = (state) => state.reports.currentReport;
export const selectReportData = (state) => state.reports.reportData;
export const selectIsLoading = (state) => state.reports.isLoading;
export const selectError = (state) => state.reports.error;
export const selectExportStatus = (state) => state.reports.exportStatus;
export const selectFilters = (state) => state.reports.filters;

// Selectors for specific report data
export const selectOverviewData = (state) => state.reports.reportData?.overview;
export const selectPerformanceData = (state) => state.reports.reportData?.performance;
export const selectAnalyticsData = (state) => state.reports.reportData?.analytics;

// Utility selectors
export const selectTotalTrips = (state) => state.reports.reportData?.overview?.totalTrips || 0;
export const selectTotalPassengers = (state) => state.reports.reportData?.overview?.totalPassengers || 0;
export const selectOnTimePercentage = (state) => state.reports.reportData?.overview?.onTimePercentage || 0;
export const selectFuelConsumption = (state) => state.reports.reportData?.overview?.fuelConsumption || 0;

export default reportsSlice.reducer; 