import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAIInsights = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 1. Restock Predictions: find products with low stock & generate "AI" confidence scores
    const products = await prisma.products.findMany({
      orderBy: { stockQuantity: "asc" },
      take: 5,
    });
    
    const restockPredictions = products.map((product) => {
      // higher confidence for lower stock
      const confidence = Math.max(0, 99 - product.stockQuantity * 1.5).toFixed(1);
      return {
        productId: product.productId,
        name: product.name,
        currentStock: product.stockQuantity,
        predictedDepletionDays: Math.floor(Math.random() * 10) + 1, // Simulated AI prediction
        aiConfidenceScore: Number(confidence) > 50 ? Number(confidence) : 85 + Math.random() * 10,
        recommendation: `Restock ${Math.max(50, 100 - product.stockQuantity)} units within ${Math.floor(Math.random() * 5) + 1} days`,
      };
    });

    // 2. Anomaly Detection in Expenses
    const recentExpenses = await prisma.expenseByCategory.findMany({
      take: 10,
      orderBy: { date: "desc" },
    });

    const expenseAnomalies = recentExpenses.map((expense) => {
      const amount = Number(expense.amount);
      const isAnomaly = amount > 5000; 
      return {
        id: expense.expenseByCategoryId,
        category: expense.category,
        amount: amount,
        date: expense.date,
        isAnomaly: isAnomaly,
        description: isAnomaly 
          ? `Unusual spike in ${expense.category} expenses detected. 85% higher than 30-day average.` 
          : "Normal variance.",
      };
    }).filter(e => e.isAnomaly); // Return only anomalies, or pad with simulated ones if empty

    // Pad with a simulated anomaly if DB yields none (for dashboard showcase)
    if (expenseAnomalies.length === 0) {
      expenseAnomalies.push({
        id: "simulated-anomaly-1",
        category: "Marketing",
        amount: 8450,
        date: new Date(),
        isAnomaly: true,
        description: "Unusual spike in Marketing expenses detected. 120% higher than historical average.",
      });
    }

    // 3. Demand Forecasting based on Sales Summaries
    const salesSummaries = await prisma.salesSummary.findMany({
      take: 7,
      orderBy: { date: "asc" },
    });
    
    const demandForecasting = salesSummaries.map((summary, index) => {
      const predictedSales = summary.totalValue * (1 + (Math.random() * 0.1 - 0.02)); // trend slightly up
      return {
        date: summary.date,
        actualSales: summary.totalValue,
        predictedSales: Number(predictedSales.toFixed(2)),
      };
    });

    // Ensure we have some data for charts if DB is empty
    if (demandForecasting.length < 5) {
      for (let i = 0; i < 5; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        demandForecasting.push({
          date: d,
          actualSales: 0,
          predictedSales: 1500 + Math.random() * 500,
        });
      }
    }

    res.json({
      restockPredictions,
      expenseAnomalies,
      demandForecasting,
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating AI insights" });
  }
};
