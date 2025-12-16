import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Location {
  id: string
  label: string
  code: string
}

export const availableLocations: Location[] = [
  { id: "PU", label: "SISB Pracha Uthit", code: "PU" },
  { id: "SV", label: "SISB Suvarnabhumi", code: "SV" },
  { id: "TB", label: "SISB Thonburi", code: "TB" },
  { id: "CM", label: "SISB Chiang Mai", code: "CM" },
  { id: "NB", label: "SISB Nonthaburi", code: "NB" },
  { id: "RY", label: "SISB Rayong", code: "RY" }
]

interface BranchContextType {
  selectedBranch: string
  setSelectedBranch: (branchId: string) => void
  availableBranches: Location[]
  getSelectedBranchLabel: () => string
}

const BranchContext = createContext<BranchContextType | undefined>(undefined)

const STORAGE_KEY = "sisb-selected-branch"

interface BranchProviderProps {
  children: ReactNode
  userLocations?: string[] // User's permitted locations
}

export function BranchProvider({ children, userLocations = [] }: BranchProviderProps) {
  // Filter locations based on user permissions
  const availableBranches = userLocations.length > 0
    ? availableLocations.filter(loc => userLocations.includes(loc.id))
    : availableLocations

  // Sort branches alphabetically by label
  const sortedBranches = [...availableBranches].sort((a, b) =>
    a.label.localeCompare(b.label)
  )

  // Get default branch (first in alphabetical order)
  const getDefaultBranch = () => {
    const stored = localStorage.getItem(STORAGE_KEY)

    // If stored branch exists and is in user's available branches, use it
    if (stored && sortedBranches.some(b => b.id === stored)) {
      return stored
    }

    // Otherwise, return first branch alphabetically
    return sortedBranches.length > 0 ? sortedBranches[0].id : ""
  }

  const [selectedBranch, setSelectedBranchState] = useState<string>(getDefaultBranch())

  // Update localStorage when branch changes
  const setSelectedBranch = (branchId: string) => {
    setSelectedBranchState(branchId)
    localStorage.setItem(STORAGE_KEY, branchId)
  }

  // Get label for selected branch
  const getSelectedBranchLabel = () => {
    const branch = availableLocations.find(loc => loc.id === selectedBranch)
    return branch ? branch.label : ""
  }

  // Update selected branch if user permissions change
  useEffect(() => {
    if (selectedBranch && !sortedBranches.some(b => b.id === selectedBranch)) {
      // Selected branch is no longer available, reset to default
      const defaultBranch = sortedBranches.length > 0 ? sortedBranches[0].id : ""
      setSelectedBranch(defaultBranch)
    }
  }, [userLocations])

  return (
    <BranchContext.Provider
      value={{
        selectedBranch,
        setSelectedBranch,
        availableBranches: sortedBranches,
        getSelectedBranchLabel
      }}
    >
      {children}
    </BranchContext.Provider>
  )
}

export function useBranch() {
  const context = useContext(BranchContext)
  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider")
  }
  return context
}
