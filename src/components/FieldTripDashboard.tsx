import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import {
  Bus,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText
} from "lucide-react"
import { format } from "date-fns"

interface FieldTrip {
  id: string
  name: string
  destination: string
  date: Date
  capacity: number
  registered: number
  paid: number
  pending: number
  unpaid: number
  totalRevenue: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  yearGroups: string[]
}

const mockTrips: FieldTrip[] = [
  {
    id: "FT001",
    name: "Science Museum Bangkok",
    destination: "National Science Museum, Pathum Thani",
    date: new Date("2024-02-15"),
    capacity: 120,
    registered: 95,
    paid: 78,
    pending: 12,
    unpaid: 5,
    totalRevenue: 234000,
    status: "upcoming",
    yearGroups: ["Year 4", "Year 5"]
  },
  {
    id: "FT002",
    name: "Ancient City Tour",
    destination: "Ancient City (Muang Boran), Samut Prakan",
    date: new Date("2024-02-20"),
    capacity: 80,
    registered: 72,
    paid: 65,
    pending: 5,
    unpaid: 2,
    totalRevenue: 216000,
    status: "upcoming",
    yearGroups: ["Year 6", "Year 7"]
  },
  {
    id: "FT003",
    name: "Chao Phraya River Cruise",
    destination: "Chao Phraya River, Bangkok",
    date: new Date("2024-02-10"),
    capacity: 60,
    registered: 60,
    paid: 60,
    pending: 0,
    unpaid: 0,
    totalRevenue: 180000,
    status: "completed",
    yearGroups: ["Year 8", "Year 9"]
  },
  {
    id: "FT004",
    name: "Safari World Adventure",
    destination: "Safari World, Bangkok",
    date: new Date("2024-03-05"),
    capacity: 100,
    registered: 45,
    paid: 30,
    pending: 10,
    unpaid: 5,
    totalRevenue: 135000,
    status: "upcoming",
    yearGroups: ["Year 1", "Year 2", "Year 3"]
  }
]

export function FieldTripDashboard() {
  const totalTrips = mockTrips.length
  const upcomingTrips = mockTrips.filter(t => t.status === "upcoming").length
  const totalRegistrations = mockTrips.reduce((sum, trip) => sum + trip.registered, 0)
  const totalRevenue = mockTrips.reduce((sum, trip) => sum + trip.totalRevenue, 0)
  const totalPaid = mockTrips.reduce((sum, trip) => sum + trip.paid, 0)
  const totalPending = mockTrips.reduce((sum, trip) => sum + trip.pending, 0)
  const totalUnpaid = mockTrips.reduce((sum, trip) => sum + trip.unpaid, 0)

  const paymentRate = totalRegistrations > 0
    ? Math.round((totalPaid / totalRegistrations) * 100)
    : 0

  const getStatusBadge = (status: FieldTrip['status']) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
      case "ongoing":
        return <Badge className="bg-green-100 text-green-800">Ongoing</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
    }
  }

  const getOccupancyColor = (registered: number, capacity: number) => {
    const percentage = (registered / capacity) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-blue-600"
    if (percentage >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>Field Trip Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of field trip activities, registrations, and payments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Field Trips</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrips}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingTrips} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              Students registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all trips
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totalPaid} of {totalRegistrations} paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPaid}</div>
            <Progress value={(totalPaid / totalRegistrations) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalPending}</div>
            <Progress value={(totalPending / totalRegistrations) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalUnpaid}</div>
            <Progress value={(totalUnpaid / totalRegistrations) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Trips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Field Trips
          </CardTitle>
          <CardDescription>
            Scheduled trips and their registration status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTrips
              .filter(trip => trip.status === "upcoming")
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((trip) => (
                <div key={trip.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{trip.name}</h4>
                      {getStatusBadge(trip.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{trip.destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(trip.date, "MMM dd, yyyy")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="text-muted-foreground">Year Groups:</span>
                      <div className="flex gap-1">
                        {trip.yearGroups.map((year, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {year}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Registration Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Registration</span>
                        <span className={`font-medium ${getOccupancyColor(trip.registered, trip.capacity)}`}>
                          {trip.registered}/{trip.capacity} ({Math.round((trip.registered / trip.capacity) * 100)}%)
                        </span>
                      </div>
                      <Progress value={(trip.registered / trip.capacity) * 100} />
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <div className="text-sm text-muted-foreground mb-1">Revenue</div>
                    <div className="text-lg font-bold">฿{trip.totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-2">Payment Status</div>
                    <div className="flex gap-2 mt-1 text-xs">
                      <span className="text-green-600">✓ {trip.paid}</span>
                      <span className="text-yellow-600">⏱ {trip.pending}</span>
                      <span className="text-red-600">✗ {trip.unpaid}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Completed Trips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recently Completed Trips
          </CardTitle>
          <CardDescription>
            Past field trips and their final statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTrips
              .filter(trip => trip.status === "completed")
              .map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium text-sm">{trip.name}</h4>
                      {getStatusBadge(trip.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(trip.date, "MMM dd, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {trip.registered} students
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        100% paid
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">฿{trip.totalRevenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
