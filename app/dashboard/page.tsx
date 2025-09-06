"use client"

import { useAuth } from "@/lib/auth/context"
import { useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  GraduationCap,
  UserCheck,
  BookOpen,
  TrendingUp,
  Calendar,
  MessageSquare,
  ClipboardCheck,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get("welcome") === "true"

  const quickActions = [
    {
      title: "Add Student",
      description: "Enroll a new student",
      href: "/dashboard/students/new",
      icon: GraduationCap,
    },
    {
      title: "Add Teacher",
      description: "Register a new teacher",
      href: "/dashboard/teachers/new",
      icon: UserCheck,
    },
    {
      title: "Create Class",
      description: "Set up a new class",
      href: "/dashboard/classes/new",
      icon: BookOpen,
    },
    {
      title: "Send Message",
      description: "Communicate with users",
      href: "/dashboard/messages/new",
      icon: MessageSquare,
    },
  ]

  const recentActivities = [
    {
      title: "New student enrollment",
      description: "Sarah Johnson enrolled in Grade 10A",
      time: "2 hours ago",
      status: "success",
    },
    {
      title: "Teacher attendance marked",
      description: "Morning attendance completed for all classes",
      time: "4 hours ago",
      status: "success",
    },
    {
      title: "Parent meeting scheduled",
      description: "Meeting with John Doe's parents on Friday",
      time: "1 day ago",
      status: "pending",
    },
    {
      title: "Assignment deadline approaching",
      description: "Math assignment due in 2 days",
      time: "2 days ago",
      status: "warning",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard" }]} />

      <div className="space-y-6">
        {/* Welcome Message */}
        {isWelcome && (
          <Alert className="border-primary/20 bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              Welcome to SchoolManagementSystem.com! Your account has been created successfully. Start by adding
              students, teachers, and setting up your classes.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.profile?.firstName}!</h1>
          <p className="text-muted-foreground">Here's what's happening at your school today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Students"
            value="1,234"
            description="Active enrollments"
            icon={GraduationCap}
            trend={{ value: 12, label: "from last month", positive: true }}
          />
          <StatsCard
            title="Teachers"
            value="56"
            description="Active staff members"
            icon={UserCheck}
            trend={{ value: 8, label: "from last month", positive: true }}
          />
          <StatsCard title="Classes" value="24" description="Active classes" icon={BookOpen} />
          <StatsCard
            title="Attendance Rate"
            value="94.2%"
            description="This week"
            icon={ClipboardCheck}
            trend={{ value: 2.1, label: "from last week", positive: true }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Quick Actions */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to get you started</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your school</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    {activity.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {activity.status === "pending" && <Clock className="h-4 w-4 text-blue-500" />}
                    {activity.status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Additional Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Today's Schedule</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Morning Assembly</span>
                <Badge variant="outline">8:00 AM</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Staff Meeting</span>
                <Badge variant="outline">10:30 AM</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Parent Conference</span>
                <Badge variant="outline">2:00 PM</Badge>
              </div>
              <Link href="/dashboard/timetable">
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  View Full Schedule
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Pending Tasks</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Grade submissions</span>
                <Badge variant="destructive">Overdue</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Attendance review</span>
                <Badge variant="secondary">Today</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Report cards</span>
                <Badge variant="outline">This week</Badge>
              </div>
              <Link href="/dashboard/reports">
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  View All Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">System Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Status</span>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge className="bg-green-500">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup</span>
                <Badge variant="outline">Last: 2h ago</Badge>
              </div>
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  System Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
