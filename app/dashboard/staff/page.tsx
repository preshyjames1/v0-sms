"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserTable } from "@/components/users/user-table"
import type { User } from "@/lib/types"

// Mock data - replace with actual Firebase queries
const mockStaff: User[] = [
  {
    id: "1",
    email: "lisa.wilson@staff.school.com",
    role: "librarian",
    schoolId: "school1",
    profile: {
      firstName: "Lisa",
      lastName: "Wilson",
      phone: "+1 (555) 567-8901",
      dateOfBirth: new Date("1982-04-18"),
      gender: "female",
      address: {
        street: "654 Cedar Ave",
        city: "Springfield",
        state: "IL",
        country: "USA",
        zipCode: "62705",
      },
    },
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
    isActive: true,
  },
]

export default function StaffPage() {
  const router = useRouter()
  const [staff, setStaff] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStaff(mockStaff)
      setLoading(false)
    }, 1000)
  }, [])

  const handleView = (staffMember: User) => {
    router.push(`/dashboard/staff/${staffMember.id}`)
  }

  const handleEdit = (staffMember: User) => {
    router.push(`/dashboard/staff/${staffMember.id}/edit`)
  }

  const handleDelete = async (staffMember: User) => {
    if (confirm(`Are you sure you want to delete ${staffMember.profile.firstName} ${staffMember.profile.lastName}?`)) {
      // Implement delete logic
      console.log("Delete staff member:", staffMember.id)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Staff" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading staff...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Staff" }]} />

      <UserTable users={staff} userType="staff" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
