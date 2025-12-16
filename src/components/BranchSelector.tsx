import { useBranch } from "../contexts/BranchContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardContent } from "./ui/card"
import { MapPin } from "lucide-react"

interface BranchSelectorProps {
  variant?: "default" | "compact"
}

export function BranchSelector({ variant = "default" }: BranchSelectorProps) {
  const { selectedBranch, setSelectedBranch, availableBranches } = useBranch()

  // Compact variant for header (minimalist)
  if (variant === "compact") {
    // If user has only one branch, show it as read-only badge
    if (availableBranches.length === 1) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-sm">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-medium">{availableBranches[0].code}</span>
        </div>
      )
    }

    // Find current branch to display code only
    const currentBranch = availableBranches.find(b => b.id === selectedBranch)

    return (
      <Select value={selectedBranch} onValueChange={setSelectedBranch}>
        <SelectTrigger className="w-[85px] h-9">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium text-sm">{currentBranch?.code || "Branch"}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {availableBranches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{branch.code}</span>
                <span className="text-xs text-muted-foreground">- {branch.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  // Default variant for dashboard (full card)
  // If user has only one branch, show it as read-only
  if (availableBranches.length === 1) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Current Branch</p>
              <p className="text-lg font-semibold text-blue-700">
                {availableBranches[0].label}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="py-3 px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <label className="text-sm font-medium text-blue-900">
              Select Branch:
            </label>
          </div>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-[280px] bg-white border-blue-300 focus:ring-blue-500">
              <SelectValue placeholder="Select a branch" />
            </SelectTrigger>
            <SelectContent>
              {availableBranches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{branch.code}</span>
                    <span className="text-muted-foreground">-</span>
                    <span>{branch.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
