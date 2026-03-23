"use client";

import React from "react";
import { useGetSalesTerritoryQuery } from "@/state/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/(components)/ui/Card";
import { Badge } from "@/app/(components)/ui/Badge";
import { Map, Users, Target, Briefcase, Award, Loader2 } from "lucide-react";

const SalesTerritory = () => {
  const { data, isLoading, isError } = useGetSalesTerritoryQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading territory data...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="m-5 text-red-500">Failed to load Sales Territory data. Please try again.</div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
          <Map className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Select Territory Sales Hub</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage representative performance and regional quotas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Regional Performance Overview */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Regional Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.regions.map((region) => (
              <div key={region.name} className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">{region.name}</h4>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{region.performance}%</span>
                  <span className="text-sm text-gray-500 mb-1">Target: {region.target}%</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                  <div 
                    className={`h-2.5 rounded-full ${region.performance >= 100 ? 'bg-emerald-500' : region.performance >= 90 ? 'bg-blue-500' : 'bg-amber-500'}`} 
                    style={{ width: `${Math.min(region.performance, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Deals */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-500" />
              Recent Deals
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {data.recentDeals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{deal.client}</span>
                  <span className="text-xs text-gray-500">{deal.rep}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    ${(deal.value / 1000).toFixed(0)}k
                  </span>
                  <Badge variant={deal.status === 'Closed Won' ? 'success' : 'outline'} className="text-[10px] mt-1 pr-1 pl-1">
                    {deal.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performers Leaderboard */}
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Top Performers Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-tl-lg">Representative</th>
                    <th scope="col" className="px-6 py-3">Territory</th>
                    <th scope="col" className="px-6 py-3">Deals Closed</th>
                    <th scope="col" className="px-6 py-3">Revenue Gen.</th>
                    <th scope="col" className="px-6 py-3 rounded-tr-lg">Quota Attainment</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPerformers.map((rep) => (
                    <tr key={rep.id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {rep.name.charAt(0)}
                        </div>
                        {rep.name}
                      </th>
                      <td className="px-6 py-4">{rep.territory}</td>
                      <td className="px-6 py-4">{rep.dealsClosed}</td>
                      <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        ${(rep.revenue / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={rep.quotaAttainment > 100 ? 'success' : rep.quotaAttainment > 90 ? 'default' : 'warning'}>
                          {rep.quotaAttainment}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SalesTerritory;
