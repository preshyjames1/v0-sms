const functions = require("firebase-functions")
const admin = require("firebase-admin")
const nodemailer = require("nodemailer")

admin.initializeApp()

// Configure email transporter (using Gmail SMTP as example)
// In production, use environment variables for credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().email.user, // Set via: firebase functions:config:set email.user="your-email@gmail.com"
    pass: functions.config().email.pass, // Set via: firebase functions:config:set email.pass="your-app-password"
  },
})

// Email templates
const emailTemplates = {
  welcomeSchoolAdmin: (userData, schoolData, tempPassword) => ({
    subject: `Welcome to ${schoolData.name} - School Management System`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">Welcome to School Management System</h1>
          <p style="color: #666; font-size: 16px;">Your school account has been created successfully!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Account Details</h2>
          <p><strong>Name:</strong> ${userData.profile.firstName} ${userData.profile.lastName}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Role:</strong> School Administrator</p>
          <p><strong>School:</strong> ${schoolData.name}</p>
          ${tempPassword ? `<p><strong>Temporary Password:</strong> ${tempPassword}</p>` : ""}
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333;">Getting Started</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>Sign in to your dashboard using the credentials above</li>
            <li>Complete your school profile setup</li>
            <li>Add your first students and teachers</li>
            <li>Explore all the features available in your plan</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://schoolmanagementsystem.com/auth/login" 
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Sign In to Dashboard
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>Need help? Contact our support team at support@schoolmanagementsystem.com</p>
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  welcomeTeacher: (userData, schoolData, tempPassword) => ({
    subject: `Welcome to ${schoolData.name} - Teacher Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">Welcome to ${schoolData.name}</h1>
          <p style="color: #666; font-size: 16px;">Your teacher account has been created!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Account Details</h2>
          <p><strong>Name:</strong> ${userData.profile.firstName} ${userData.profile.lastName}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Role:</strong> Teacher</p>
          <p><strong>School:</strong> ${schoolData.name}</p>
          <p><strong>Employee ID:</strong> ${userData.employeeId || "Will be assigned"}</p>
          ${tempPassword ? `<p><strong>Temporary Password:</strong> ${tempPassword}</p>` : ""}
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333;">What You Can Do</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>Manage your classes and students</li>
            <li>Take attendance and track student progress</li>
            <li>Create and grade assignments</li>
            <li>Communicate with students and parents</li>
            <li>Access teaching resources and materials</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://schoolmanagementsystem.com/auth/login" 
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Access Teacher Portal
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>Questions? Contact your school administrator or our support team.</p>
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  welcomeStudent: (userData, schoolData, parentEmails, tempPassword) => ({
    subject: `Welcome to ${schoolData.name} - Student Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">Welcome to ${schoolData.name}</h1>
          <p style="color: #666; font-size: 16px;">Your student account has been created!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Student Details</h2>
          <p><strong>Name:</strong> ${userData.profile.firstName} ${userData.profile.lastName}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Student ID:</strong> ${userData.admissionNumber || "Will be assigned"}</p>
          <p><strong>School:</strong> ${schoolData.name}</p>
          ${tempPassword ? `<p><strong>Temporary Password:</strong> ${tempPassword}</p>` : ""}
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333;">Student Portal Features</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>View your class schedule and timetable</li>
            <li>Check attendance records</li>
            <li>Access assignments and homework</li>
            <li>View grades and report cards</li>
            <li>Communicate with teachers</li>
            <li>Access learning resources</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://schoolmanagementsystem.com/auth/login" 
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Access Student Portal
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>Parents/Guardians: ${parentEmails.join(", ")}</p>
          <p>Questions? Contact your teachers or school administration.</p>
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  welcomeParent: (userData, schoolData, childrenNames, tempPassword) => ({
    subject: `Welcome to ${schoolData.name} - Parent Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">Welcome to ${schoolData.name}</h1>
          <p style="color: #666; font-size: 16px;">Your parent account has been created!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Account Details</h2>
          <p><strong>Name:</strong> ${userData.profile.firstName} ${userData.profile.lastName}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Role:</strong> Parent/Guardian</p>
          <p><strong>School:</strong> ${schoolData.name}</p>
          <p><strong>Children:</strong> ${childrenNames.join(", ")}</p>
          ${tempPassword ? `<p><strong>Temporary Password:</strong> ${tempPassword}</p>` : ""}
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333;">Parent Portal Features</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>Monitor your child's attendance and academic progress</li>
            <li>View grades, assignments, and report cards</li>
            <li>Communicate with teachers and school staff</li>
            <li>Receive important school announcements</li>
            <li>Track fee payments and financial information</li>
            <li>Schedule parent-teacher conferences</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://schoolmanagementsystem.com/auth/login" 
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Access Parent Portal
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>Stay connected with your child's education journey!</p>
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (userData, resetLink) => ({
    subject: "Password Reset Request - School Management System",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">Password Reset Request</h1>
          <p style="color: #666; font-size: 16px;">We received a request to reset your password</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p>Hello ${userData.profile.firstName},</p>
          <p>You requested to reset your password for your School Management System account. Click the button below to create a new password:</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0; color: #856404;"><strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all;">${resetLink}</p>
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  announcement: (announcementData, schoolData, recipientName) => ({
    subject: `${schoolData.name} - ${announcementData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">${schoolData.name}</h1>
          <p style="color: #666; font-size: 16px;">School Announcement</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">${announcementData.title}</h2>
          <p style="color: #666; margin-bottom: 15px;">
            <strong>Date:</strong> ${new Date(announcementData.createdAt).toLocaleDateString()}<br>
            <strong>Priority:</strong> ${announcementData.priority || "Normal"}
          </p>
          <div style="color: #333; line-height: 1.6;">
            ${announcementData.content.replace(/\n/g, "<br>")}
          </div>
        </div>
        
        ${
          announcementData.attachments && announcementData.attachments.length > 0
            ? `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">Attachments</h3>
            <ul style="color: #666;">
              ${announcementData.attachments.map((att) => `<li><a href="${att.url}" style="color: #16a34a;">${att.name}</a></li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p>This announcement was sent to: ${recipientName}</p>
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </div>
    `,
  }),
}

// Helper function to send email
async function sendEmail(to, template) {
  try {
    const mailOptions = {
      from: `"School Management System" <${functions.config().email.user}>`,
      to: to,
      subject: template.subject,
      html: template.html,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error.message }
  }
}

// Cloud Function: Send welcome email when a new user is created
exports.sendWelcomeEmail = functions.firestore.document("users/{userId}").onCreate(async (snap, context) => {
  const userData = snap.data()
  const userId = context.params.userId

  try {
    // Get school data
    const schoolDoc = await admin.firestore().doc(`schools/${userData.schoolId}`).get()
    if (!schoolDoc.exists) {
      console.error("School not found for user:", userId)
      return null
    }
    const schoolData = schoolDoc.data()

    let template
    const additionalData = {}

    // Generate temporary password if needed
    const tempPassword = userData.tempPassword || null

    switch (userData.role) {
      case "school_admin":
        template = emailTemplates.welcomeSchoolAdmin(userData, schoolData, tempPassword)
        break

      case "teacher":
        template = emailTemplates.welcomeTeacher(userData, schoolData, tempPassword)
        break

      case "student":
        // Get parent emails
        const parentEmails = []
        if (userData.parentIds && userData.parentIds.length > 0) {
          const parentDocs = await Promise.all(
            userData.parentIds.map((id) => admin.firestore().doc(`users/${id}`).get()),
          )
          parentDocs.forEach((doc) => {
            if (doc.exists) {
              parentEmails.push(doc.data().email)
            }
          })
        }
        template = emailTemplates.welcomeStudent(userData, schoolData, parentEmails, tempPassword)
        break

      case "parent":
        // Get children names
        const childrenNames = []
        if (userData.childrenIds && userData.childrenIds.length > 0) {
          const childrenDocs = await Promise.all(
            userData.childrenIds.map((id) => admin.firestore().doc(`users/${id}`).get()),
          )
          childrenDocs.forEach((doc) => {
            if (doc.exists) {
              const child = doc.data()
              childrenNames.push(`${child.profile.firstName} ${child.profile.lastName}`)
            }
          })
        }
        template = emailTemplates.welcomeParent(userData, schoolData, childrenNames, tempPassword)
        break

      default:
        // For other roles (staff, etc.), use a generic welcome template
        template = emailTemplates.welcomeTeacher(userData, schoolData, tempPassword)
        break
    }

    // Send the email
    const result = await sendEmail(userData.email, template)

    // Log the result
    await admin
      .firestore()
      .collection("emailLogs")
      .add({
        userId: userId,
        email: userData.email,
        type: "welcome",
        role: userData.role,
        success: result.success,
        messageId: result.messageId || null,
        error: result.error || null,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
      })

    return result
  } catch (error) {
    console.error("Error in sendWelcomeEmail function:", error)
    return null
  }
})

// Cloud Function: Send password reset email
exports.sendPasswordResetEmail = functions.https.onCall(async (data, context) => {
  // Verify the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated")
  }

  const { email, resetLink } = data

  try {
    // Get user data
    const userQuery = await admin.firestore().collection("users").where("email", "==", email).limit(1).get()

    if (userQuery.empty) {
      throw new functions.https.HttpsError("not-found", "User not found")
    }

    const userData = userQuery.docs[0].data()
    const template = emailTemplates.passwordReset(userData, resetLink)

    // Send the email
    const result = await sendEmail(email, template)

    // Log the result
    await admin
      .firestore()
      .collection("emailLogs")
      .add({
        userId: userQuery.docs[0].id,
        email: email,
        type: "password_reset",
        success: result.success,
        messageId: result.messageId || null,
        error: result.error || null,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
      })

    return { success: result.success }
  } catch (error) {
    console.error("Error in sendPasswordResetEmail function:", error)
    throw new functions.https.HttpsError("internal", "Failed to send password reset email")
  }
})

// Cloud Function: Send announcement emails
exports.sendAnnouncementEmail = functions.firestore
  .document("announcements/{announcementId}")
  .onCreate(async (snap, context) => {
    const announcementData = snap.data()
    const announcementId = context.params.announcementId

    try {
      // Get school data
      const schoolDoc = await admin.firestore().doc(`schools/${announcementData.schoolId}`).get()
      if (!schoolDoc.exists) {
        console.error("School not found for announcement:", announcementId)
        return null
      }
      const schoolData = schoolDoc.data()

      // Get recipients based on target audience
      let recipientQuery = admin
        .firestore()
        .collection("users")
        .where("schoolId", "==", announcementData.schoolId)
        .where("isActive", "==", true)

      // Filter by target audience
      if (announcementData.targetAudience && announcementData.targetAudience !== "all") {
        if (Array.isArray(announcementData.targetAudience)) {
          recipientQuery = recipientQuery.where("role", "in", announcementData.targetAudience)
        } else {
          recipientQuery = recipientQuery.where("role", "==", announcementData.targetAudience)
        }
      }

      const recipientsSnapshot = await recipientQuery.get()

      // Send emails to all recipients
      const emailPromises = recipientsSnapshot.docs.map(async (doc) => {
        const recipient = doc.data()
        const recipientName = `${recipient.profile.firstName} ${recipient.profile.lastName}`
        const template = emailTemplates.announcement(announcementData, schoolData, recipientName)

        const result = await sendEmail(recipient.email, template)

        // Log each email
        await admin
          .firestore()
          .collection("emailLogs")
          .add({
            userId: doc.id,
            email: recipient.email,
            type: "announcement",
            announcementId: announcementId,
            success: result.success,
            messageId: result.messageId || null,
            error: result.error || null,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
          })

        return result
      })

      const results = await Promise.all(emailPromises)
      const successCount = results.filter((r) => r.success).length
      const failureCount = results.length - successCount

      console.log(`Announcement emails sent: ${successCount} successful, ${failureCount} failed`)

      // Update announcement with email stats
      await snap.ref.update({
        emailStats: {
          totalSent: results.length,
          successful: successCount,
          failed: failureCount,
          sentAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      })

      return { totalSent: results.length, successful: successCount, failed: failureCount }
    } catch (error) {
      console.error("Error in sendAnnouncementEmail function:", error)
      return null
    }
  })

// Cloud Function: Send bulk notification emails
exports.sendBulkNotificationEmail = functions.https.onCall(async (data, context) => {
  // Verify the user is authenticated and has permission
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated")
  }

  const { recipients, subject, content, schoolId } = data

  try {
    // Verify user has permission to send bulk emails
    const userDoc = await admin.firestore().doc(`users/${context.auth.uid}`).get()
    if (!userDoc.exists) {
      throw new functions.https.HttpsError("not-found", "User not found")
    }

    const userData = userDoc.data()
    if (!["school_admin", "sub_admin"].includes(userData.role)) {
      throw new functions.https.HttpsError("permission-denied", "Insufficient permissions")
    }

    // Get school data
    const schoolDoc = await admin.firestore().doc(`schools/${schoolId}`).get()
    if (!schoolDoc.exists) {
      throw new functions.https.HttpsError("not-found", "School not found")
    }
    const schoolData = schoolDoc.data()

    // Send emails to all recipients
    const emailPromises = recipients.map(async (recipient) => {
      const customTemplate = {
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #16a34a; margin-bottom: 10px;">${schoolData.name}</h1>
              <p style="color: #666; font-size: 16px;">Important Notification</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">${subject}</h2>
              <div style="color: #333; line-height: 1.6;">
                ${content.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
              <p>This message was sent to: ${recipient.name}</p>
              <p>© 2024 School Management System. All rights reserved.</p>
            </div>
          </div>
        `,
      }

      const result = await sendEmail(recipient.email, customTemplate)

      // Log each email
      await admin
        .firestore()
        .collection("emailLogs")
        .add({
          userId: recipient.userId || null,
          email: recipient.email,
          type: "bulk_notification",
          subject: subject,
          success: result.success,
          messageId: result.messageId || null,
          error: result.error || null,
          sentBy: context.auth.uid,
          sentAt: admin.firestore.FieldValue.serverTimestamp(),
        })

      return result
    })

    const results = await Promise.all(emailPromises)
    const successCount = results.filter((r) => r.success).length
    const failureCount = results.length - successCount

    return { totalSent: results.length, successful: successCount, failed: failureCount }
  } catch (error) {
    console.error("Error in sendBulkNotificationEmail function:", error)
    throw new functions.https.HttpsError("internal", "Failed to send bulk notification emails")
  }
})

// Cloud Function: Clean up old email logs (runs daily)
exports.cleanupEmailLogs = functions.pubsub.schedule("0 2 * * *").onRun(async (context) => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  try {
    const oldLogsQuery = admin.firestore().collection("emailLogs").where("sentAt", "<", thirtyDaysAgo).limit(500) // Process in batches

    const snapshot = await oldLogsQuery.get()

    if (snapshot.empty) {
      console.log("No old email logs to clean up")
      return null
    }

    const batch = admin.firestore().batch()
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    await batch.commit()
    console.log(`Cleaned up ${snapshot.docs.length} old email logs`)

    return null
  } catch (error) {
    console.error("Error cleaning up email logs:", error)
    return null
  }
})

// Cloud Function: Handle role assignments
exports.assignUserRole = functions.https.onCall(async (data, context) => {
  // Verify the user is authenticated and has permission
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated")
  }

  const { userId, roleId, schoolId } = data

  try {
    // Verify user has permission to assign roles
    const adminDoc = await admin.firestore().doc(`users/${context.auth.uid}`).get()
    if (!adminDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Admin user not found")
    }

    const adminData = adminDoc.data()
    if (adminData.role !== "school_admin" || adminData.schoolId !== schoolId) {
      throw new functions.https.HttpsError("permission-denied", "Insufficient permissions")
    }

    // Create role assignment
    await admin.firestore().collection("userRoles").add({
      userId: userId,
      roleId: roleId,
      schoolId: schoolId,
      assignedBy: context.auth.uid,
      assignedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    // Update user document with role assignment
    await admin
      .firestore()
      .doc(`users/${userId}`)
      .update({
        customRoles: admin.firestore.FieldValue.arrayUnion(roleId),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })

    return { success: true }
  } catch (error) {
    console.error("Error in assignUserRole function:", error)
    throw new functions.https.HttpsError("internal", "Failed to assign role")
  }
})

// Cloud Function: Create Firebase Auth account for new users
exports.createUserAuth = functions.https.onCall(async (data, context) => {
  // Verify the user is authenticated and has permission
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated")
  }

  const { email, password, userData } = data

  try {
    // Verify user has permission to create accounts
    const adminDoc = await admin.firestore().doc(`users/${context.auth.uid}`).get()
    if (!adminDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Admin user not found")
    }

    const adminData = adminDoc.data()
    if (!["school_admin", "admin_assistant", "principal"].includes(adminData.role)) {
      throw new functions.https.HttpsError("permission-denied", "Insufficient permissions")
    }

    // Create Firebase Auth account
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: `${userData.profile.firstName} ${userData.profile.lastName}`,
      emailVerified: false,
    })

    // Set custom claims for role-based access
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: userData.role,
      schoolId: userData.schoolId,
    })

    return { success: true, uid: userRecord.uid }
  } catch (error) {
    console.error("Error in createUserAuth function:", error)
    throw new functions.https.HttpsError("internal", `Failed to create user account: ${error.message}`)
  }
})

// Cloud Function: Update user authentication when profile changes
exports.updateUserAuth = functions.firestore.document("users/{userId}").onUpdate(async (change, context) => {
  const beforeData = change.before.data()
  const afterData = change.after.data()
  const userId = context.params.userId

  try {
    // Check if role or school changed
    if (beforeData.role !== afterData.role || beforeData.schoolId !== afterData.schoolId) {
      // Update custom claims
      await admin.auth().setCustomUserClaims(userId, {
        role: afterData.role,
        schoolId: afterData.schoolId,
      })
      console.log(`Updated custom claims for user: ${userId}`)
    }

    // Check if name changed
    if (
      beforeData.profile.firstName !== afterData.profile.firstName ||
      beforeData.profile.lastName !== afterData.profile.lastName
    ) {
      // Update display name
      await admin.auth().updateUser(userId, {
        displayName: `${afterData.profile.firstName} ${afterData.profile.lastName}`,
      })
      console.log(`Updated display name for user: ${userId}`)
    }

    return null
  } catch (error) {
    console.error("Error in updateUserAuth function:", error)
    return null
  }
})

// Cloud Function: Handle class enrollment notifications
exports.notifyClassEnrollment = functions.firestore.document("classes/{classId}").onUpdate(async (change, context) => {
  const beforeData = change.before.data()
  const afterData = change.after.data()
  const classId = context.params.classId

  try {
    // Check if students were added to the class
    const beforeStudents = beforeData.studentIds || []
    const afterStudents = afterData.studentIds || []
    const newStudents = afterStudents.filter((id) => !beforeStudents.includes(id))

    if (newStudents.length === 0) {
      return null
    }

    // Get school data
    const schoolDoc = await admin.firestore().doc(`schools/${afterData.schoolId}`).get()
    if (!schoolDoc.exists) {
      return null
    }
    const schoolData = schoolDoc.data()

    // Send enrollment notifications to new students and their parents
    const notificationPromises = newStudents.map(async (studentId) => {
      const studentDoc = await admin.firestore().doc(`users/${studentId}`).get()
      if (!studentDoc.exists) return

      const studentData = studentDoc.data()

      // Email template for class enrollment
      const enrollmentTemplate = {
        subject: `Class Enrollment - ${afterData.name} at ${schoolData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #16a34a;">Class Enrollment Notification</h1>
            <p>Dear ${studentData.profile.firstName},</p>
            <p>You have been enrolled in <strong>${afterData.name}</strong>.</p>
            <p><strong>Class Details:</strong></p>
            <ul>
              <li>Class: ${afterData.name}</li>
              <li>Grade Level: ${afterData.gradeLevel}</li>
              <li>Section: ${afterData.section}</li>
              <li>Academic Year: ${afterData.academicYear}</li>
            </ul>
            <p>Please check your student portal for more information.</p>
          </div>
        `,
      }

      // Send email to student
      await sendEmail(studentData.email, enrollmentTemplate)

      // Send email to parents if they exist
      if (studentData.parentIds && studentData.parentIds.length > 0) {
        const parentPromises = studentData.parentIds.map(async (parentId) => {
          const parentDoc = await admin.firestore().doc(`users/${parentId}`).get()
          if (!parentDoc.exists) return

          const parentData = parentDoc.data()

          const parentTemplate = {
            ...enrollmentTemplate,
            html: enrollmentTemplate.html.replace(
              `Dear ${studentData.profile.firstName}`,
              `Dear ${parentData.profile.firstName}, your child ${studentData.profile.firstName}`,
            ),
          }
          await sendEmail(parentData.email, parentTemplate)
        })
        await Promise.all(parentPromises)
      }
    })

    await Promise.all(notificationPromises)
    console.log(`Sent enrollment notifications for ${newStudents.length} students in class ${classId}`)

    return null
  } catch (error) {
    console.error("Error in notifyClassEnrollment function:", error)
    return null
  }
})

// Cloud Function: Send attendance notifications to parents
exports.sendAttendanceNotifications = functions.firestore
  .document("attendance/{attendanceId}")
  .onCreate(async (snap, context) => {
    const attendanceData = snap.data()

    try {
      // Only send notifications for absent students
      if (attendanceData.status !== "absent") {
        return null
      }

      // Get student data
      const studentDoc = await admin.firestore().doc(`users/${attendanceData.studentId}`).get()
      if (!studentDoc.exists) {
        return null
      }
      const studentData = studentDoc.data()

      // Get school data
      const schoolDoc = await admin.firestore().doc(`schools/${attendanceData.schoolId}`).get()
      if (!schoolDoc.exists) {
        return null
      }
      const schoolData = schoolDoc.data()

      // Send notifications to parents
      if (studentData.parentIds && studentData.parentIds.length > 0) {
        const parentPromises = studentData.parentIds.map(async (parentId) => {
          const parentDoc = await admin.firestore().doc(`users/${parentId}`).get()
          if (!parentDoc.exists) return

          const parentData = parentDoc.data()

          const absenceTemplate = {
            subject: `Attendance Alert - ${studentData.profile.firstName} ${studentData.profile.lastName}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #dc2626;">Attendance Alert</h1>
              <p>Dear ${parentData.profile.firstName},</p>
              <p>This is to inform you that your child <strong>${studentData.profile.firstName} ${studentData.profile.lastName}</strong> was marked absent today.</p>
              <p><strong>Details:</strong></p>
              <ul>
                <li>Date: ${new Date(attendanceData.date).toLocaleDateString()}</li>
                <li>Class: ${attendanceData.className || "N/A"}</li>
                <li>School: ${schoolData.name}</li>
              </ul>
              <p>If this is an error or if you have any concerns, please contact the school immediately.</p>
            </div>
          `,
          }

          await sendEmail(parentData.email, absenceTemplate)
        })

        await Promise.all(parentPromises)
        console.log(`Sent absence notifications for student ${attendanceData.studentId}`)
      }

      return null
    } catch (error) {
      console.error("Error in sendAttendanceNotifications function:", error)
      return null
    }
  })
