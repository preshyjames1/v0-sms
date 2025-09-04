"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { doc, setDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserForm } from "@/components/users/user-form"
import type { User } from "@/lib/types"

export default function NewTeacherPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (userData: Partial<User> & { password?: string }) => {
    if (!user?.schoolId) {
      throw new Error("School ID not found")
    }

    if (!userData.password) {
      throw new Error("Password is required")
    }

    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email!, userData.password)
      const firebaseUser = userCredential.user

      console.log("[v0] Created Firebase Auth user with UID:", firebaseUser.uid)

      const userDoc = {
        uid: firebaseUser.uid,
        email: userData.email,
        role: userData.role || "teacher",
        schoolId: user.schoolId,
        profile: userData.profile,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(doc(db, "users", firebaseUser.uid), userDoc)

      console.log("[v0] Created Firestore document with ID:", firebaseUser.uid)

      try {
        console.log("Welcome email should be sent to:", userData.email)
      } catch (emailError) {
        console.warn("Failed to send welcome email:", emailError)
      }

      router.push("/dashboard/teachers")
    } catch (error: any) {
      console.error("Error creating teacher:", error)
      if (error.code === "auth/email-already-in-use") {
        throw new Error("This email address is already registered")
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password is too weak. Please use at least 6 characters")
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address")
      }
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
          { title: "Teachers", href: "/dashboard/teachers" },
          { title: "Add New Teacher" },
        ]}
      />

      <UserForm userType="teachers" onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
