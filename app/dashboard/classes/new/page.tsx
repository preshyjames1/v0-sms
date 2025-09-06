"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClassForm } from "@/components/academic/class-form"
import type { Class } from "@/lib/types/academic"

export default function NewClassPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (classData: Partial<Class>) => {
    if (!user?.schoolId) {
      throw new Error("School ID not found")
    }

    setIsLoading(true)
    try {
      const classToCreate = {
        ...classData,
        schoolId: user.schoolId,
        classTeacherId: "", // Will be assigned later
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }

      const docRef = await addDoc(collection(db, "classes"), classToCreate)
      console.log("Class created with ID:", docRef.id)

      router.push("/dashboard/classes")
    } catch (error) {
      console.error("Error creating class:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Classes", href: "/dashboard/classes" },
          { title: "Add New Class" },
        ]}
      />

      <ClassForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
