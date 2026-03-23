"use client";

import React from "react";
import { useGetAIInsightsQuery } from "@/state/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/(components)/ui/Card";
import { Badge } from "@/app/(components)/ui/Badge";
import { Brain, TrendingUp, AlertTriangle, PackageOpen, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AIInsights = () => {
  const { data, isLoading, isError } = useGetAIInsightsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Analyzing inventory data...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="m-5 text-red-500">Failed to generate AI Insights. Please try again.</div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
          <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Productivity Insights</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Intelligent analysis and forecasting for your inventory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Restock Predictions */}
        <Card className="lg:col-span-1 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PackageOpen className="w-5 h-5 text-amber-500" />
              Restock Predictions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {data.restockPredictions.length === 0 ? (
              <p className="text-sm text-gray-500">Inventory levels are optimal.</p>
            ) : (
              data.restockPredictions.map((pred) => (
                <div key={pred.productId} className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{pred.name}</h4>
                      <p className="text-xs text-gray-500">Stock: {pred.currentStock}</p>
                    </div>
                    <Badge variant={pred.aiConfidenceScore > 80 ? "success" : "warning"}>
                      {pred.aiConfidenceScore}% Confidence
                    </Badge>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {pred.recommendation}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Expense Anomalies */}
        <Card className="lg:col-span-1 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Anomaly Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {data.expenseAnomalies.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-3">
                  <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">All Systems Normal</p>
                <p className="text-xs text-gray-500 mt-1">No financial anomalies detected.</p>
              </div>
            ) : (
              data.expenseAnomalies.map((anomaly) => (
                <div key={anomaly.id} className="flex flex-col gap-2 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{anomaly.category}</h4>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                      ${anomaly.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-300">
                    {anomaly.description}
                  </p>
                  <div className="text-[10px] text-gray-500 text-right mt-1">
                    Detected on {new Date(anomaly.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Demand Forecasting Chart */}
        <Card className="lg:col-span-1 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Demand Forecasting
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.demandForecasting}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="actualSales" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Actual"
                  dot={{ r: 4, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predictedSales" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="AI Forecast"
                  dot={{ r: 4, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AIInsights;
