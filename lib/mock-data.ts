export const mockIncidents = [
  {
    title: "Slip and Fall in Warehouse",
    description: "Employee slipped on wet floor in loading area",
    severity: "Medium",
    status: "Under Investigation",
    category: "Injury",
    location: "Warehouse A - Loading Bay",
    reportedBy: "John Smith"
  },
  {
    title: "Chemical Spill - Lab 3",
    description: "Small acetone spill during transfer operation",
    severity: "Low",
    status: "Resolved",
    category: "Environmental",
    location: "Laboratory 3",
    reportedBy: "Sarah Johnson"
  },
  {
    title: "Near Miss - Forklift Operation",
    description: "Forklift nearly collided with pedestrian",
    severity: "High",
    status: "Under Investigation",
    category: "Near Miss",
    location: "Warehouse B",
    reportedBy: "Mike Chen"
  }
];

export const mockInspections = [
  {
    title: "Monthly Fire Safety Inspection",
    type: "Safety",
    location: "Building A - All Floors",
    inspector: "Fire Marshal",
    status: "Scheduled",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  },
  {
    title: "PPE Compliance Audit",
    type: "Compliance",
    location: "Manufacturing Floor",
    inspector: "Safety Officer",
    status: "Completed",
    score: 95,
    findings: "Overall excellent compliance. Minor issues with glove storage.",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];

export const mockTrainings = [
  {
    title: "Hazardous Waste Management",
    description: "Required training for all lab personnel on proper hazardous waste disposal",
    type: "Environmental",
    instructor: "Dr. Emily Watson",
    location: "Training Room 1",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    maxAttendees: 20,
    attendees: JSON.stringify(["Alice Brown", "Bob Wilson", "Carol Davis"]),
    status: "Scheduled"
  },
  {
    title: "First Aid & CPR Certification",
    description: "Annual first aid and CPR recertification",
    type: "Health",
    instructor: "Certified Paramedic Team",
    location: "Medical Center",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    maxAttendees: 15,
    attendees: JSON.stringify([]),
    status: "Open for Registration"
  }
];

export const mockPermits = [
  {
    title: "Hot Work Permit - Welding Operations",
    type: "Hot Work",
    location: "Manufacturing Floor - Section C",
    requestedBy: "David Martinez",
    status: "Approved",
    approvedBy: "Safety Manager",
    startDate: new Date(),
    endDate: new Date(Date.now() + 8 * 60 * 60 * 1000),
    hazards: "Fire, Burns, Fumes",
    controls: "Fire extinguisher on site, Fire watch assigned, Area cleared of combustibles"
  },
  {
    title: "Confined Space Entry - Tank Cleaning",
    type: "Confined Space",
    location: "Tank Farm - Tank 5",
    requestedBy: "James Lee",
    status: "Pending Approval",
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
    hazards: "Oxygen deficiency, Toxic atmosphere, Engulfment",
    controls: "Atmospheric testing, Ventilation, Standby rescue team, Communication equipment"
  }
];

export const mockChemicals = [
  {
    name: "Acetone",
    casNumber: "67-64-1",
    location: "Chemical Storage Room A",
    quantity: "50",
    unit: "L",
    hazardClass: "Flammable Liquid",
    sdsUrl: "https://example.com/sds/acetone.pdf",
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    lastInspected: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  },
  {
    name: "Sulfuric Acid",
    casNumber: "7664-93-9",
    location: "Chemical Storage Room B",
    quantity: "25",
    unit: "L",
    hazardClass: "Corrosive",
    sdsUrl: "https://example.com/sds/sulfuric-acid.pdf",
    expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
    lastInspected: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  },
  {
    name: "Sodium Hydroxide",
    casNumber: "1310-73-2",
    location: "Laboratory 2",
    quantity: "10",
    unit: "kg",
    hazardClass: "Corrosive",
    sdsUrl: "https://example.com/sds/sodium-hydroxide.pdf",
    expiryDate: new Date(Date.now() + 500 * 24 * 60 * 60 * 1000),
    lastInspected: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
  }
];
