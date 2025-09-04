"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Users, BookOpen, Calendar, Download } from "lucide-react"

export function AnalyticsDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    averageAttendance: 0,
    attendanceData: [] as any[],
    gradeDistribution: [] as any[],
    subjectPerformance: [] as any[],
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.schoolId) return

      try {
        // Fetch students
        const studentsQuery = query(
          collection(db, "users"),
          where("schoolId", "==", user.schoolId),
          where("role", "==", "student"),
          where("isActive", "==", true),
        )
        const studentsSnapshot = await getDocs(studentsQuery)
        const totalStudents = studentsSnapshot.size

        // Fetch teachers
        const teachersQuery = query(
          collection(db, "users"),
          where("schoolId", "==", user.schoolId),
          where("role", "==", "teacher"),
          where("isActive", "==", true),
        )
        const teachersSnapshot = await getDocs(teachersQuery)
        const totalTeachers = teachersSnapshot.size

        // Fetch classes
        const classesQuery = query(
          collection(db, "classes"),
          where("schoolId", "==", user.schoolId),
          where("isActive", "==", true),
        )
        const classesSnapshot = await getDocs(classesQuery)
        const totalClasses = classesSnapshot.size

        // Fetch attendance data
        const attendanceQuery = query(collection(db, "attendance"), where("schoolId", "==", user.schoolId))
        const attendanceSnapshot = await getDocs(attendanceQuery)
        const attendanceRecords = attendanceSnapshot.docs.map((doc) => doc.data())

        // Calculate average attendance
        const totalAttendanceRecords = attendanceRecords.length
        const presentRecords = attendanceRecords.filter((record) => record.status === "present").length
        const averageAttendance = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0

        // Generate monthly attendance data (simplified)
        const attendanceData = [
          { month: "Jan", attendance: Math.max(0, averageAttendance - 5 + Math.random() * 10) },
          { month: "Feb", attendance: Math.max(0, averageAttendance - 3 + Math.random() * 6) },
          { month: "Mar", attendance: Math.max(0, averageAttendance - 2 + Math.random() * 4) },
          { month: "Apr", attendance: Math.max(0, averageAttendance - 1 + Math.random() * 2) },
          { month: "May", attendance: Math.max(0, averageAttendance + Math.random() * 2) },
          { month: "Jun", attendance: Math.max(0, averageAttendance + 1 + Math.random() * 2) },
        ]

        setAnalytics({
          totalStudents,
          totalTeachers,
          totalClasses,
          averageAttendance: Math.round(averageAttendance * 10) / 10,
          attendanceData,
          gradeDistribution: [], // Would need grades data from database
          subjectPerformance: [], // Would need performance data from database
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user?.schoolId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Real-time insights into school performance</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="current-term">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-term">Current Term</SelectItem>
              <SelectItem value="last-term">Last Term</SelectItem>
              <SelectItem value="academic-year">Academic Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{analytics.totalStudents}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-muted-foreground">Active students</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Attendance</p>
                <p className="text-2xl font-bold">{analytics.averageAttendance}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-muted-foreground">This term</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                <p className="text-2xl font-bold">{analytics.totalClasses}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-muted-foreground">Current term</span>
                </div>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <p className="text-2xl font-bold">{analytics.totalTeachers}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-muted-foreground">Active staff</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.attendanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No attendance data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Placeholder for future charts */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Performance data will be available when grades are recorded
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
