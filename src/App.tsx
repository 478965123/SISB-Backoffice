import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "./components/ui/sidebar"
import { Toaster } from "./components/ui/sonner"
import { Button } from "./components/ui/button"
import { LanguageSwitcher } from "./components/LanguageSwitcher"
import {
  BarChart3,
  Calendar,
  FileText,
  Users,
  Settings,
  CreditCard,
  GraduationCap,
  Receipt,
  Bell,
  UserCheck,

  ArrowLeft,
  RotateCcw,
  Eye,
  Mail,
  Send,
  CalendarDays,
  Upload,
  Clock,
  FileBarChart,
  Sun,
  Play,
  DollarSign,
  Percent,
  Tag,
  Gift,
  TrendingDown,
  FileCheck,
  FileText as FileInvoice,

  Settings2,
  MapPin,
  Bus
} from "lucide-react"
import { TuitionDashboard } from "./components/TuitionDashboard"
import { TuitionTermSettings } from "./components/TuitionTermSettings"
import { DebtReminderSettings } from "./components/DebtReminderSettings"
import { PaymentHistory } from "./components/PaymentHistory"
import { TuitionInvoiceManagement } from "./components/TuitionInvoiceManagement"
import { AfterSchoolDashboard } from "./components/AfterSchoolDashboard"
import { AfterSchoolSettings } from "./components/AfterSchoolSettings"
import { CourseQuotaOverview } from "./components/CourseQuotaOverview"
import { ExternalParentManagement } from "./components/ExternalParentManagement"

import { AfterSchoolReceipts } from "./components/AfterSchoolReceiptsUpdated"

import { CourseStudentReport } from "./components/CourseStudentReport"
import { EventImport } from "./components/EventImport"
import { EventPaymentDeadline } from "./components/EventPaymentDeadline"
import { EventRegistrationReports } from "./components/EventRegistrationReports"
import { EventReceipts } from "./components/EventReceiptsUpdated"
import { SummerActivitiesImport } from "./components/SummerActivitiesImport"
import { SummerRegistrationControl } from "./components/SummerRegistrationControl"
import { SummerPaymentReports } from "./components/SummerPaymentReports"
import { SummerActivitiesReceipts } from "./components/SummerActivitiesReceiptsUpdated"
import { InvoiceManagement } from "./components/InvoiceManagement"
import { InvoiceCreation } from "./components/InvoiceCreation"
import { ItemManagement } from "./components/ItemManagement"
import { EmailJobsManagement } from "./components/EmailJobsManagement"
import { EmailHistoryView } from "./components/EmailHistoryView"
import { EmailCsvExport } from "./components/EmailCsvExport"

import { ViewModal } from "./components/ViewModal"
import { ViewDetailsPage } from "./components/ViewDetailsPage"
import { UserManagement } from "./components/UserManagement"
import { FieldTripDashboard } from "./components/FieldTripDashboard"
import { TripManagement } from "./components/TripManagement"
import { FieldTripPaymentReports } from "./components/FieldTripPaymentReports"
import { FieldTripReceipts } from "./components/FieldTripReceipts"

const menuItems = {
  tuition: [
    { id: "tuition-dashboard", labelKey: "menu.dashboard", icon: BarChart3 },
    { id: "tuition-term-settings", labelKey: "menu.termSettings", icon: Calendar },
    { id: "debt-reminder-settings", labelKey: "menu.debtReminders", icon: Bell },
    { id: "payment-history", labelKey: "menu.paymentHistory", icon: CreditCard },
    { id: "tuition-invoice-management", labelKey: "menu.transactionManagement", icon: FileText },
  ],
  afterSchool: [
    { id: "afterschool-dashboard", labelKey: "menu.dashboard", icon: BarChart3 },
    { id: "afterschool-settings", labelKey: "menu.registrationSettings", icon: Settings },
    { id: "afterschool-payment-history", labelKey: "menu.paymentHistory", icon: CreditCard },
    { id: "course-quota-overview", labelKey: "menu.courseQuota", icon: GraduationCap },
    { id: "afterschool-receipts", labelKey: "menu.receipts", icon: Receipt },
  ],
  eventManagement: [
    { id: "event-import", labelKey: "menu.eventImport", icon: Upload },
    { id: "event-payment-deadline", labelKey: "menu.paymentDeadline", icon: Clock },
    { id: "event-registration-reports", labelKey: "menu.registrationReports", icon: FileBarChart },
    { id: "external-parent-management", labelKey: "menu.externalParents", icon: UserCheck },
    { id: "event-receipts", labelKey: "menu.receipts", icon: Receipt },
  ],
  summerActivities: [
    { id: "summer-activities-import", labelKey: "menu.summerActivitiesImport", icon: Upload },
    { id: "summer-registration-control", labelKey: "menu.registrationControl", icon: Play },
    { id: "summer-payment-reports", labelKey: "menu.paymentReports", icon: DollarSign },
    { id: "summer-activities-receipts", labelKey: "menu.receipts", icon: Receipt },
  ],
  fieldTrip: [
    { id: "field-trip-dashboard", labelKey: "menu.dashboard", icon: BarChart3 },
    { id: "field-trip-management", labelKey: "menu.tripManagement", icon: Bus },
    { id: "field-trip-payment-reports", labelKey: "menu.paymentReports", icon: DollarSign },
    { id: "field-trip-receipts", labelKey: "menu.receipts", icon: Receipt },
  ],
  invoiceManagement: [
    { id: "invoice-management", labelKey: "menu.invoices", icon: FileInvoice },
  ],
  emailNotifications: [
    { id: "email-jobs", labelKey: "menu.emailJobs", icon: Mail },
  ],
  userManagement: [
    { id: "user-management", labelKey: "menu.userManagement", icon: Users },
  ]
}

export default function App() {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState("tuition-dashboard")
  const [subPageHistory, setSubPageHistory] = useState<string[]>([])

  const [subPageParams, setSubPageParams] = useState<any>(null)
  
  // Global View Modal state (keeping for backward compatibility)
  const [isGlobalViewModalOpen, setIsGlobalViewModalOpen] = useState(false)
  const [globalViewModalData, setGlobalViewModalData] = useState<any>(null)
  const [globalViewModalType, setGlobalViewModalType] = useState<"invoice" | "student" | "item" | "receipt" | "payment" | "course" | "template">("invoice")
  
  // ViewDetailsPage state
  const [viewDetailsData, setViewDetailsData] = useState<any>(null)
  const [viewDetailsType, setViewDetailsType] = useState<"invoice" | "student" | "item" | "receipt" | "payment" | "course" | "template">("invoice")

  const navigateToSubPage = (subPage: string, params?: any) => {
    setSubPageHistory([...subPageHistory, activeSection])
    setActiveSection(subPage)
    setSubPageParams(params)
  }

  // Navigate to View Details Page
  const navigateToViewDetails = (type: "invoice" | "student" | "item" | "receipt" | "payment" | "course" | "template", data: any) => {
    setViewDetailsType(type)
    setViewDetailsData(data)
    setSubPageHistory([...subPageHistory, activeSection])
    setActiveSection("view-details")
    setSubPageParams({ type, data })
  }

  // Global View Modal functions
  const openGlobalViewModal = (type: "invoice" | "student" | "item" | "receipt" | "payment" | "course" | "template", data: any) => {
    setGlobalViewModalType(type)
    setGlobalViewModalData(data)
    setIsGlobalViewModalOpen(true)
  }

  const handleGlobalEdit = (data: any) => {
    setIsGlobalViewModalOpen(false)
    // Handle edit based on type
    console.log("Edit:", globalViewModalType, data)
  }

  const handleGlobalDownload = (data: any) => {
    console.log("Download:", globalViewModalType, data)
  }

  const handleGlobalPrint = (data: any) => {
    console.log("Print:", globalViewModalType, data)
  }

  // ViewDetailsPage handlers
  const handleViewDetailsEdit = (data: any) => {
    console.log("Edit:", viewDetailsType, data)
    // Navigate back or to edit page based on type
    navigateBack()
  }

  const handleViewDetailsDownload = (data: any) => {
    console.log("Download:", viewDetailsType, data)
  }

  const handleViewDetailsPrint = (data: any) => {
    console.log("Print:", viewDetailsType, data)
  }

  const navigateBack = () => {
    if (subPageHistory.length > 0) {
      const previousPage = subPageHistory[subPageHistory.length - 1]
      setSubPageHistory(subPageHistory.slice(0, -1))
      setActiveSection(previousPage)
      setSubPageParams(null)
    }
  }

  const isSubPage = subPageHistory.length > 0

  const renderContent = () => {
    switch (activeSection) {
      case "tuition-dashboard":
        return <TuitionDashboard />
      case "tuition-term-settings":
        return <TuitionTermSettings />
      case "debt-reminder-settings":
        return <DebtReminderSettings />
      case "payment-history":
        return <PaymentHistory />
      case "tuition-invoice-management":
        return <TuitionInvoiceManagement />
      case "afterschool-dashboard":
        return <AfterSchoolDashboard />
      case "afterschool-settings":
        return <AfterSchoolSettings onSaveComplete={() => setActiveSection("course-quota-overview")} />
      case "afterschool-payment-history":
        return <PaymentHistory type="afterschool" />
      case "course-quota-overview":
        return <CourseQuotaOverview onNavigateToSubPage={navigateToSubPage} />
      case "course-student-report":
        return <CourseStudentReport />
      case "external-parent-management":
        return <ExternalParentManagement />
      case "afterschool-receipts":
        return <AfterSchoolReceipts />
      case "event-import":
        return <EventImport />
      case "event-payment-deadline":
        return <EventPaymentDeadline />
      case "event-registration-reports":
        return <EventRegistrationReports />
      case "event-receipts":
        return <EventReceipts />
      case "summer-activities-import":
        return <SummerActivitiesImport />
      case "summer-registration-control":
        return <SummerRegistrationControl />
      case "summer-payment-reports":
        return <SummerPaymentReports />
      case "summer-activities-receipts":
        return <SummerActivitiesReceipts />
      case "field-trip-dashboard":
        return <FieldTripDashboard />
      case "field-trip-management":
        return <TripManagement />
      case "field-trip-payment-reports":
        return <FieldTripPaymentReports />
      case "field-trip-receipts":
        return <FieldTripReceipts />
      case "invoice-management":
        return <InvoiceManagement onNavigateToSubPage={navigateToSubPage} onNavigateToView={navigateToViewDetails} />
      case "invoice-creation":
        return <InvoiceCreation 
          defaultCategory={subPageParams?.defaultCategory}
          invoiceType={subPageParams?.invoiceType}
        />
      case "item-management":
        return <ItemManagement onNavigateToSubPage={navigateToSubPage} onNavigateToView={navigateToViewDetails} />
      case "email-jobs":
        return <EmailJobsManagement onNavigateToSubPage={navigateToSubPage} />
      case "email-history-view":
        return <EmailHistoryView jobData={subPageParams?.job} onBack={navigateBack} />
      case "email-csv-export":
        return <EmailCsvExport jobData={subPageParams?.job} onBack={navigateBack} />
      case "user-management":
        return <UserManagement />
      case "view-details":
        return <ViewDetailsPage 
          type={viewDetailsType}
          data={viewDetailsData}
          onEdit={handleViewDetailsEdit}
          onDownload={handleViewDetailsDownload}
          onPrint={handleViewDetailsPrint}
          onBack={navigateBack}
        />

      default:
        return <TuitionDashboard />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">{t('app.title')}</h2>
                <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t('sidebar.tuitionManagement')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.tuition.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className={activeSection === item.id ? "!bg-black !text-white !font-bold" : ""}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{t(item.labelKey)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('sidebar.afterSchool')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.afterSchool.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className={activeSection === item.id ? "!bg-black !text-white !font-bold" : ""}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{t(item.labelKey)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('sidebar.eventManagement')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.eventManagement.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className={activeSection === item.id ? "!bg-black !text-white !font-bold" : ""}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{t(item.labelKey)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('sidebar.summerActivities')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.summerActivities.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className={activeSection === item.id ? "!bg-black !text-white !font-bold" : ""}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{t(item.labelKey)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('sidebar.fieldTrip')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.fieldTrip.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className={activeSection === item.id ? "!bg-black !text-white !font-bold" : ""}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{t(item.labelKey)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('sidebar.invoiceManagement')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.invoiceManagement.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className={activeSection === item.id ? "!bg-black !text-white !font-bold" : ""}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{t(item.labelKey)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('sidebar.emailNotifications')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.emailNotifications.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className={activeSection === item.id ? "!bg-black !text-white !font-bold" : ""}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{t(item.labelKey)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('sidebar.userManagement')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.userManagement.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className={activeSection === item.id ? "!bg-black !text-white !font-bold" : ""}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{t(item.labelKey)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="border-b p-4 flex items-center gap-4">
            <SidebarTrigger />
            {isSubPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={navigateBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('common.back')}
              </Button>
            )}
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {(() => {
                  const menuItem =
                    menuItems.tuition.find(item => item.id === activeSection) ||
                    menuItems.afterSchool.find(item => item.id === activeSection) ||
                    menuItems.eventManagement.find(item => item.id === activeSection) ||
                    menuItems.summerActivities.find(item => item.id === activeSection) ||
                    menuItems.fieldTrip.find(item => item.id === activeSection) ||
                    menuItems.invoiceManagement.find(item => item.id === activeSection) ||
                    menuItems.emailNotifications.find(item => item.id === activeSection) ||
                    menuItems.userManagement.find(item => item.id === activeSection)

                  if (menuItem) return t(menuItem.labelKey)

                  if (activeSection === "invoice-creation") {
                    if (subPageParams?.invoiceType === "tuition") return t('pages.createTuitionInvoice')
                    if (subPageParams?.invoiceType === "eca") return t('pages.createECAInvoice')
                    if (subPageParams?.invoiceType === "trip") return t('pages.createTripInvoice')
                    return t('pages.createInvoice')
                  }
                  if (activeSection === "email-jobs") return t('menu.emailJobs')
                  if (activeSection === "email-history-view") return t('pages.emailDeliveryHistory')
                  if (activeSection === "email-csv-export") return t('pages.exportEmailLogs')
                  if (activeSection === "view-details") {
                    if (viewDetailsType === "invoice") return t('pages.invoiceDetails')
                    if (viewDetailsType === "student") return t('pages.studentProfile')
                    if (viewDetailsType === "item") return t('pages.itemDetails')
                    if (viewDetailsType === "receipt") return t('pages.receiptDetails')
                    if (viewDetailsType === "payment") return t('pages.paymentDetails')
                    if (viewDetailsType === "course") return t('pages.courseDetails')
                    if (viewDetailsType === "template") return t('pages.templateDetails')
                    return "Details"
                  }
                  if (activeSection === "item-management") return t('menu.itemsTemplates')
                  return t('menu.dashboard')
                })()}
              </h1>
            </div>
            <LanguageSwitcher />

          </header>
          
          <div className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      <Toaster position="top-right" richColors />
      
      {/* Global View Modal */}
      <ViewModal
        isOpen={isGlobalViewModalOpen}
        onClose={() => setIsGlobalViewModalOpen(false)}
        type={globalViewModalType}
        data={globalViewModalData}
        onEdit={handleGlobalEdit}
        onDownload={handleGlobalDownload}
        onPrint={handleGlobalPrint}
      />
    </SidebarProvider>
  )
}