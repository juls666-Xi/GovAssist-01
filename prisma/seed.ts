import { PrismaClient, UserRole, UserStatus, ProgramStatus, ApplicationStatus, DocumentType, DocumentStatus, NotificationType, AuditAction, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.application.deleteMany();
  await prisma.programRequirement.deleteMany();
  await prisma.assistanceProgram.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const passwordHash = await bcrypt.hash("password123", 12);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "System Administrator",
      email: "admin@govassist.local",
      username: "admin",
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      firstName: "System",
      lastName: "Administrator",
      phone: "+63-912-345-6789",
      address: "City Hall Building, Main Street",
      barangay: "Poblacion",
      city: "Metro City",
      province: "Metro Province",
      zipCode: "1000",
    },
  });

  // Create Staff
  const staff1 = await prisma.user.create({
    data: {
      name: "Juan Dela Cruz",
      email: "staff@govassist.local",
      username: "staff1",
      passwordHash,
      role: UserRole.STAFF,
      status: UserStatus.ACTIVE,
      firstName: "Juan",
      lastName: "Dela Cruz",
      phone: "+63-913-456-7890",
      address: "123 Staff Avenue",
      barangay: "Barangay 1",
      city: "Metro City",
      province: "Metro Province",
      zipCode: "1001",
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      name: "Maria Santos",
      email: "staff2@govassist.local",
      username: "staff2",
      passwordHash,
      role: UserRole.STAFF,
      status: UserStatus.ACTIVE,
      firstName: "Maria",
      lastName: "Santos",
      phone: "+63-914-567-8901",
      address: "456 Staff Boulevard",
      barangay: "Barangay 2",
      city: "Metro City",
      province: "Metro Province",
      zipCode: "1002",
    },
  });

  // Create Citizens
  const citizens = await Promise.all([
    prisma.user.create({
      data: {
        name: "Pedro Reyes",
        email: "pedro@email.com",
        username: "pedro123",
        passwordHash,
        role: UserRole.CITIZEN,
        status: UserStatus.ACTIVE,
        firstName: "Pedro",
        lastName: "Reyes",
        middleName: "Garcia",
        dateOfBirth: new Date("1985-03-15"),
        phone: "+63-915-678-9012",
        address: "789 Citizen Street",
        barangay: "Barangay 3",
        city: "Metro City",
        province: "Metro Province",
        zipCode: "1003",
        idType: "Passport",
        idNumber: "P123456789",
      },
    }),
    prisma.user.create({
      data: {
        name: "Ana Lim",
        email: "ana@email.com",
        username: "ana456",
        passwordHash,
        role: UserRole.CITIZEN,
        status: UserStatus.ACTIVE,
        firstName: "Ana",
        lastName: "Lim",
        middleName: "Cruz",
        dateOfBirth: new Date("1990-07-22"),
        phone: "+63-916-789-0123",
        address: "321 Citizen Road",
        barangay: "Barangay 4",
        city: "Metro City",
        province: "Metro Province",
        zipCode: "1004",
        idType: "Driver's License",
        idNumber: "DL987654321",
      },
    }),
    prisma.user.create({
      data: {
        name: "Carlos Tan",
        email: "carlos@email.com",
        username: "carlos789",
        passwordHash,
        role: UserRole.CITIZEN,
        status: UserStatus.ACTIVE,
        firstName: "Carlos",
        lastName: "Tan",
        middleName: "Reyes",
        dateOfBirth: new Date("1978-11-08"),
        phone: "+63-917-890-1234",
        address: "654 Citizen Lane",
        barangay: "Barangay 5",
        city: "Metro City",
        province: "Metro Province",
        zipCode: "1005",
        idType: "National ID",
        idNumber: "NID456789123",
      },
    }),
  ]);

  // Create Assistance Programs
  const programs = await Promise.all([
    prisma.assistanceProgram.create({
      data: {
        name: "Medical Assistance Program",
        description: "Financial assistance for medical expenses including hospitalization, medicines, and laboratory fees for indigent patients.",
        category: "Health",
        requirements: "Valid ID, Medical Certificate, Proof of Income, Barangay Certificate of Residency",
        benefits: "Up to ₱50,000 coverage for medical expenses",
        eligibility: "Indigent residents with monthly income below ₱15,000",
        status: ProgramStatus.ACTIVE,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        budget: new Prisma.Decimal("5000000.00"),
        maxApplicants: 1000,
        currentApplicants: 3,
        icon: "Heart",
        color: "#ef4444",
        createdBy: admin.id,
        requirements_list: {
          create: [
            { name: "Valid Government ID", description: "Any valid government-issued ID", isRequired: true, documentType: "ID_PROOF", sortOrder: 1 },
            { name: "Medical Certificate", description: "Certification from attending physician", isRequired: true, documentType: "MEDICAL_RECORD", sortOrder: 2 },
            { name: "Proof of Income", description: "Latest payslip or certificate of indigency", isRequired: true, documentType: "INCOME_PROOF", sortOrder: 3 },
            { name: "Barangay Certificate", description: "Certificate of residency from barangay", isRequired: true, documentType: "RESIDENCY_PROOF", sortOrder: 4 },
          ],
        },
      },
    }),
    prisma.assistanceProgram.create({
      data: {
        name: "Educational Assistance Program",
        description: "Financial support for students from low-income families to cover tuition fees, books, and school supplies.",
        category: "Education",
        requirements: "Valid ID, School Registration, Proof of Income, Barangay Certificate",
        benefits: "Up to ₱20,000 per semester for tuition and supplies",
        eligibility: "Students from families with income below ₱20,000 monthly",
        status: ProgramStatus.ACTIVE,
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-08-31"),
        budget: new Prisma.Decimal("3000000.00"),
        maxApplicants: 500,
        currentApplicants: 2,
        icon: "GraduationCap",
        color: "#3b82f6",
        createdBy: admin.id,
        requirements_list: {
          create: [
            { name: "Valid Government ID", description: "Any valid government-issued ID", isRequired: true, documentType: "ID_PROOF", sortOrder: 1 },
            { name: "School Registration", description: "Current school registration or enrollment form", isRequired: true, documentType: "OTHER", sortOrder: 2 },
            { name: "Proof of Income", description: "Latest payslip or certificate of indigency", isRequired: true, documentType: "INCOME_PROOF", sortOrder: 3 },
            { name: "Barangay Certificate", description: "Certificate of residency from barangay", isRequired: true, documentType: "RESIDENCY_PROOF", sortOrder: 4 },
          ],
        },
      },
    }),
    prisma.assistanceProgram.create({
      data: {
        name: "Senior Citizen Assistance",
        description: "Monthly financial assistance and benefits for senior citizens including healthcare support and grocery allowances.",
        category: "Social Welfare",
        requirements: "Senior Citizen ID, Proof of Residency, Birth Certificate",
        benefits: "₱1,000 monthly allowance + free medical checkups",
        eligibility: "Residents aged 60 years and above",
        status: ProgramStatus.ACTIVE,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        budget: new Prisma.Decimal("2000000.00"),
        maxApplicants: 2000,
        currentApplicants: 1,
        icon: "Users",
        color: "#8b5cf6",
        createdBy: admin.id,
        requirements_list: {
          create: [
            { name: "Senior Citizen ID", description: "Official Senior Citizen ID card", isRequired: true, documentType: "ID_PROOF", sortOrder: 1 },
            { name: "Birth Certificate", description: "PSA-issued birth certificate", isRequired: true, documentType: "BIRTH_CERTIFICATE", sortOrder: 2 },
            { name: "Proof of Residency", description: "Barangay certificate or utility bill", isRequired: true, documentType: "RESIDENCY_PROOF", sortOrder: 3 },
          ],
        },
      },
    }),
    prisma.assistanceProgram.create({
      data: {
        name: "Livelihood Assistance Program",
        description: "Seed capital and training support for small business owners and entrepreneurs in the community.",
        category: "Economic",
        requirements: "Valid ID, Business Plan, Barangay Certificate, Proof of Residency",
        benefits: "Up to ₱30,000 seed capital + free business training",
        eligibility: "Residents with viable business proposals",
        status: ProgramStatus.ACTIVE,
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-11-30"),
        budget: new Prisma.Decimal("4000000.00"),
        maxApplicants: 300,
        currentApplicants: 0,
        icon: "Briefcase",
        color: "#10b981",
        createdBy: admin.id,
        requirements_list: {
          create: [
            { name: "Valid Government ID", description: "Any valid government-issued ID", isRequired: true, documentType: "ID_PROOF", sortOrder: 1 },
            { name: "Business Plan", description: "Detailed business proposal document", isRequired: true, documentType: "OTHER", sortOrder: 2 },
            { name: "Barangay Certificate", description: "Certificate of good moral character", isRequired: true, documentType: "RESIDENCY_PROOF", sortOrder: 3 },
          ],
        },
      },
    }),
    prisma.assistanceProgram.create({
      data: {
        name: "Disaster Relief Assistance",
        description: "Emergency financial and material assistance for families affected by natural disasters and calamities.",
        category: "Emergency",
        requirements: "Valid ID, Barangay Certificate, Damage Assessment Report",
        benefits: "Emergency cash assistance up to ₱25,000 + relief goods",
        eligibility: "Families affected by declared disasters",
        status: ProgramStatus.ACTIVE,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        budget: new Prisma.Decimal("10000000.00"),
        maxApplicants: 5000,
        currentApplicants: 0,
        icon: "AlertTriangle",
        color: "#f59e0b",
        createdBy: admin.id,
        requirements_list: {
          create: [
            { name: "Valid Government ID", description: "Any valid government-issued ID", isRequired: true, documentType: "ID_PROOF", sortOrder: 1 },
            { name: "Barangay Certificate", description: "Certificate of residency and calamity affected", isRequired: true, documentType: "RESIDENCY_PROOF", sortOrder: 2 },
            { name: "Damage Assessment", description: "Barangay or DSWD damage assessment report", isRequired: true, documentType: "OTHER", sortOrder: 3 },
          ],
        },
      },
    }),
  ]);

  // Create Applications
  const applications = await Promise.all([
    prisma.application.create({
      data: {
        applicationNumber: "APP-2024-0001",
        userId: citizens[0].id,
        programId: programs[0].id,
        status: ApplicationStatus.APPROVED,
        formData: { hospital: "Metro General Hospital", diagnosis: "Pneumonia", estimatedCost: 35000 },
        remarks: "Approved for partial coverage",
        reviewNotes: "Patient meets all criteria. Medical records verified.",
        reviewedBy: staff1.id,
        reviewedAt: new Date("2024-01-15"),
        approvedBy: admin.id,
        approvedAt: new Date("2024-01-16"),
        submittedAt: new Date("2024-01-10"),
      },
    }),
    prisma.application.create({
      data: {
        applicationNumber: "APP-2024-0002",
        userId: citizens[1].id,
        programId: programs[1].id,
        status: ApplicationStatus.PENDING,
        formData: { school: "Metro State University", course: "BS Computer Science", yearLevel: "2nd Year" },
        submittedAt: new Date("2024-02-01"),
      },
    }),
    prisma.application.create({
      data: {
        applicationNumber: "APP-2024-0003",
        userId: citizens[2].id,
        programId: programs[2].id,
        status: ApplicationStatus.REVIEWING,
        formData: { age: 65, pensionStatus: "No pension" },
        reviewNotes: "Age and residency verification in progress",
        reviewedBy: staff2.id,
        reviewedAt: new Date("2024-02-10"),
        submittedAt: new Date("2024-02-05"),
      },
    }),
    prisma.application.create({
      data: {
        applicationNumber: "APP-2024-0004",
        userId: citizens[0].id,
        programId: programs[1].id,
        status: ApplicationStatus.DOCUMENTS_REQUIRED,
        formData: { school: "Metro High School", gradeLevel: "Grade 11" },
        reviewNotes: "Missing proof of income and barangay certificate",
        reviewedBy: staff1.id,
        reviewedAt: new Date("2024-02-20"),
        submittedAt: new Date("2024-02-15"),
      },
    }),
    prisma.application.create({
      data: {
        applicationNumber: "APP-2024-0005",
        userId: citizens[1].id,
        programId: programs[0].id,
        status: ApplicationStatus.SCHEDULED,
        formData: { hospital: "City Medical Center", diagnosis: "Appendicitis", estimatedCost: 45000 },
        reviewNotes: "Approved for full coverage",
        reviewedBy: staff2.id,
        reviewedAt: new Date("2024-03-01"),
        approvedBy: admin.id,
        approvedAt: new Date("2024-03-02"),
        submittedAt: new Date("2024-02-25"),
      },
    }),
  ]);

  // Create Documents
  await Promise.all([
    prisma.document.create({
      data: {
        userId: citizens[0].id,
        applicationId: applications[0].id,
        type: DocumentType.ID_PROOF,
        name: "Passport.pdf",
        fileUrl: "https://utfs.io/f/passport-demo.pdf",
        fileKey: "passport-demo",
        fileSize: 2048000,
        fileType: "application/pdf",
        status: DocumentStatus.VERIFIED,
        verifiedBy: staff1.id,
        verifiedAt: new Date("2024-01-12"),
      },
    }),
    prisma.document.create({
      data: {
        userId: citizens[0].id,
        applicationId: applications[0].id,
        type: DocumentType.MEDICAL_RECORD,
        name: "Medical_Certificate.pdf",
        fileUrl: "https://utfs.io/f/medical-demo.pdf",
        fileKey: "medical-demo",
        fileSize: 1536000,
        fileType: "application/pdf",
        status: DocumentStatus.VERIFIED,
        verifiedBy: staff1.id,
        verifiedAt: new Date("2024-01-13"),
      },
    }),
    prisma.document.create({
      data: {
        userId: citizens[1].id,
        applicationId: applications[1].id,
        type: DocumentType.ID_PROOF,
        name: "Drivers_License.jpg",
        fileUrl: "https://utfs.io/f/license-demo.jpg",
        fileKey: "license-demo",
        fileSize: 1024000,
        fileType: "image/jpeg",
        status: DocumentStatus.PENDING,
      },
    }),
  ]);

  // Create Schedules
  await Promise.all([
    prisma.schedule.create({
      data: {
        applicationId: applications[4].id,
        userId: citizens[1].id,
        programId: programs[0].id,
        scheduledDate: new Date("2024-03-15"),
        scheduledTime: "09:00 AM",
        location: "City Hall - Social Services Office, Room 205",
        notes: "Bring valid ID and medical records for claim processing",
        status: "SCHEDULED",
        createdBy: staff2.id,
      },
    }),
  ]);

  // Create Notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: citizens[0].id,
        type: NotificationType.APPLICATION_APPROVED,
        title: "Application Approved",
        message: "Your Medical Assistance application (APP-2024-0001) has been approved. You can now schedule your claim.",
        link: "/citizen/applications/APP-2024-0001",
        isRead: true,
      },
    }),
    prisma.notification.create({
      data: {
        userId: citizens[1].id,
        type: NotificationType.APPLICATION_SUBMITTED,
        title: "Application Received",
        message: "Your Educational Assistance application (APP-2024-0002) has been received and is pending review.",
        link: "/citizen/applications/APP-2024-0002",
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: citizens[2].id,
        type: NotificationType.APPLICATION_REVIEWING,
        title: "Under Review",
        message: "Your Senior Citizen Assistance application (APP-2024-0003) is currently being reviewed by our staff.",
        link: "/citizen/applications/APP-2024-0003",
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: citizens[0].id,
        type: NotificationType.DOCUMENT_REQUIRED,
        title: "Documents Required",
        message: "Your Educational Assistance application (APP-2024-0004) requires additional documents: Proof of Income, Barangay Certificate.",
        link: "/citizen/applications/APP-2024-0004",
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: citizens[1].id,
        type: NotificationType.SCHEDULE_ASSIGNED,
        title: "Claim Schedule Assigned",
        message: "Your claim schedule for Medical Assistance (APP-2024-0005) is set for March 15, 2024 at 9:00 AM.",
        link: "/citizen/applications/APP-2024-0005",
        isRead: false,
      },
    }),
  ]);

  // Create System Settings
  await Promise.all([
    prisma.systemSetting.create({
      data: { key: "app_name", value: "GovAssist Pro", description: "Application name displayed in UI", category: "GENERAL", isPublic: true },
    }),
    prisma.systemSetting.create({
      data: { key: "max_file_size", value: "10485760", description: "Maximum file upload size in bytes (10MB)", category: "UPLOAD", isPublic: true },
    }),
    prisma.systemSetting.create({
      data: { key: "allowed_file_types", value: "pdf,jpg,jpeg,png,doc,docx", description: "Allowed file types for upload", category: "UPLOAD", isPublic: true },
    }),
    prisma.systemSetting.create({
      data: { key: "maintenance_mode", value: "false", description: "Enable maintenance mode", category: "SYSTEM", isPublic: false },
    }),
    prisma.systemSetting.create({
      data: { key: "registration_enabled", value: "true", description: "Allow new user registrations", category: "AUTH", isPublic: true },
    }),
    prisma.systemSetting.create({
      data: { key: "contact_email", value: "support@govassist.local", description: "Support contact email", category: "GENERAL", isPublic: true },
    }),
    prisma.systemSetting.create({
      data: { key: "contact_phone", value: "+63-2-8123-4567", description: "Support contact phone", category: "GENERAL", isPublic: true },
    }),
  ]);

  // Create Audit Logs
  await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: AuditAction.LOGIN,
        entity: "User",
        entityId: admin.id,
        details: "Admin logged in successfully",
        ipAddress: "192.168.1.1",
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: AuditAction.CREATE,
        entity: "AssistanceProgram",
        entityId: programs[0].id,
        details: "Created Medical Assistance Program",
        ipAddress: "192.168.1.1",
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: staff1.id,
        action: AuditAction.UPDATE,
        entity: "Application",
        entityId: applications[0].id,
        oldValue: { status: "PENDING" },
        newValue: { status: "APPROVED" },
        details: "Approved medical assistance application",
        ipAddress: "192.168.1.2",
      },
    }),
  ]);

  console.log("✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: ${await prisma.user.count()} (1 Admin, 2 Staff, 3 Citizens)`);
  console.log(`   - Programs: ${await prisma.assistanceProgram.count()}`);
  console.log(`   - Applications: ${await prisma.application.count()}`);
  console.log(`   - Documents: ${await prisma.document.count()}`);
  console.log(`   - Notifications: ${await prisma.notification.count()}`);
  console.log(`   - Audit Logs: ${await prisma.auditLog.count()}`);
  console.log("\n🔑 Default credentials:");
  console.log("   Admin: admin@govassist.local / password123");
  console.log("   Staff: staff@govassist.local / password123");
  console.log("   Citizen: pedro@email.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
