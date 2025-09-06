"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserTable } from "@/components/users/user-table"
import type { User } from "@/lib/types"

// Mock data - replace with actual Firebase queries
const mockParents: User[] = [
  {
    id: "1",
    email: "robert.doe@parent.school.com",
    role: "parent",
    schoolId: "school1",
    profile: {
      firstName: "Robert",
      lastName: "Doe",
      phone: "+1 (555) 456-7890",
      dateOfBirth: new Date("1975-08-20"),
      gender: "male",
      address: {
        street: "123 Main St",
        city: "Springfield",
        state: "IL",
        country: "USA",
        zipCode: "62701",
      },
    },
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
    isActive: true,
  },
]

export default function ParentsPage() {
  const router = useRouter()
  const [parents, setParents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setParents(mockParents)
      setLoading(false)
    }, 1000)
  }, [])

  const handleView = (parent: User) => {
    router.push(`/dashboard/parents/${parent.id}`)
  }

  const handleEdit = (parent: User) => {
    router.push(`/dashboard/parents/${parent.id}/edit`)
  }

  const handleDelete = async (parent: User) => {
    if (confirm(`Are you sure you want to delete ${parent.profile.firstName} ${parent.profile.lastName}?`)) {
      // Implement delete logic
      console.log("Delete parent:", parent.id)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Parents" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading parents...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Parents" }]} />

      <UserTable users={parents} userType="parents" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
