import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: number;
  compareText?: string;
  iconBgClass: string;
  iconColorClass: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  change,
  compareText = 'vs last month',
  iconBgClass,
  iconColorClass,
}: StatsCardProps) {
  const isPositive = change >= 0;
  
  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
            <h2 className="text-2xl font-bold mt-1">{value}</h2>
          </div>
          <div className={`${iconBgClass} p-2 rounded-lg`}>
            <div className={iconColorClass}>{icon}</div>
          </div>
        </div>
        <div className="flex items-center mt-4 text-xs">
          <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            {Math.abs(change)}%
          </span>
          <span className="ml-2 text-gray-500 dark:text-gray-400">{compareText}</span>
        </div>
      </CardContent>
    </Card>
  );
}
