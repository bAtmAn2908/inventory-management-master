import { Request, Response } from "express";

export const getSalesTerritoryData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // We will mock this data to fulfill the "Select Territory Sales Hub" JD requirement.
    // In a real application, this would query a SalesRepresentatives and Quota table.
    const territoryData = {
      regions: [
        { name: "North America", performance: 92, target: 100 },
        { name: "EMEA", performance: 85, target: 100 },
        { name: "APAC", performance: 110, target: 100 },
      ],
      topPerformers: [
        { id: "rep-1", name: "Alice Johnson", territory: "West Coast (US)", dealsClosed: 45, revenue: 1250000, quotaAttainment: 112 },
        { id: "rep-2", name: "David Chen", territory: "APAC North", dealsClosed: 38, revenue: 980000, quotaAttainment: 105 },
        { id: "rep-3", name: "Sarah Smith", territory: "UK & Ireland", dealsClosed: 42, revenue: 1100000, quotaAttainment: 98 },
        { id: "rep-4", name: "Marcus Johnson", territory: "East Coast (US)", dealsClosed: 35, revenue: 850000, quotaAttainment: 92 },
      ],
      recentDeals: [
        { id: "deal-1", client: "TechCorp Inc.", value: 150000, rep: "Alice Johnson", status: "Closed Won", date: new Date().toISOString() },
        { id: "deal-2", client: "Global Industries", value: 350000, rep: "David Chen", status: "Closed Won", date: new Date(Date.now() - 86400000).toISOString() },
        { id: "deal-3", client: "MedDevice LLC", value: 75000, rep: "Sarah Smith", status: "Negotiation", date: new Date(Date.now() - 172800000).toISOString() },
      ]
    };

    res.json(territoryData);
  } catch (error) {
    res.status(500).json({ message: "Error generating sales territory data" });
  }
};
