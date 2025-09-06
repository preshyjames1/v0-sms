"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserTable } from "@/components/users/user-table"
import type { User } from "@/lib/types"

// Mock data - replace with actual Firebase queries
const mockTeachers: User[] = [
  {
    id: "1",
    email: "sarah.johnson@teacher.school.com",
    role: "teacher",
    schoolId: "school1",
    profile: {
      firstName: "Sarah",
      lastName: "Johnson",
      phone: "+1 (555) 234-5678",
      dateOfBirth: new Date("1985-03-12"),
      gender: "female",
      address: {
        street: "789 Pine St",
        city: "Springfield",
        state: "IL",
        country: "USA",
        zipCode: "62703",
      },
    },
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    isActive: true,
  },
  {
    id: "2",
    email: "michael.brown@teacher.school.com",
    role: "teacher",
    schoolId: "school1",
    profile: {
      firstName: "Michael",
      lastName: "Brown",
      phone: "+1 (555) 345-6789",
      dateOfBirth: new Date("1978-11-08"),
      gender: "male",
      address: {
        street: "321 Elm St",
        city: "Springfield",
        state: "IL",
        country: "USA",
        zipCode: "62704",
      },
    },
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
    isActive: true,
  },
]

export default function TeachersPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setTeachers(mockTeachers)
      setLoading(false)
    }, 1000)
  }, [])

  const handleView = (teacher: User) => {
    router.push(`/dashboard/teachers/${teacher.id}`)
  }

  const handleEdit = (teacher: User) => {
    router.push(`/dashboard/teachers/${teacher.id}/edit`)
  }

  const handleDelete = async (teacher: User) => {
    if (confirm(`Are you sure you want to delete ${teacher.profile.firstName} ${teacher.profile.lastName}?`)) {
      // Implement delete logic
      console.log("Delete teacher:", teacher.id)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Teachers" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading teachers...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Teachers" }]} />

      <UserTable users={teachers} userType="teachers" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
