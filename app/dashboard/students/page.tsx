"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserTable } from "@/components/users/user-table"
import type { User } from "@/lib/types"

// Mock data - replace with actual Firebase queries
const mockStudents: User[] = [
  {
    id: "1",
    email: "john.doe@student.school.com",
    role: "student",
    schoolId: "school1",
    profile: {
      firstName: "John",
      lastName: "Doe",
      phone: "+1 (555) 123-4567",
      dateOfBirth: new Date("2008-05-15"),
      gender: "male",
      address: {
        street: "123 Main St",
        city: "Springfield",
        state: "IL",
        country: "USA",
        zipCode: "62701",
      },
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    isActive: true,
  },
  {
    id: "2",
    email: "jane.smith@student.school.com",
    role: "student",
    schoolId: "school1",
    profile: {
      firstName: "Jane",
      lastName: "Smith",
      phone: "+1 (555) 987-6543",
      dateOfBirth: new Date("2007-09-22"),
      gender: "female",
      address: {
        street: "456 Oak Ave",
        city: "Springfield",
        state: "IL",
        country: "USA",
        zipCode: "62702",
      },
    },
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    isActive: true,
  },
]

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStudents(mockStudents)
      setLoading(false)
    }, 1000)
  }, [])

  const handleView = (student: User) => {
    router.push(`/dashboard/students/${student.id}`)
  }

  const handleEdit = (student: User) => {
    router.push(`/dashboard/students/${student.id}/edit`)
  }

  const handleDelete = async (student: User) => {
    if (confirm(`Are you sure you want to delete ${student.profile.firstName} ${student.profile.lastName}?`)) {
      // Implement delete logic
      console.log("Delete student:", student.id)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Students" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading students...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Students" }]} />

      <UserTable users={students} userType="students" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
