
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
  Label
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SubcategoryBarChartProps {
  data: {
    name: string;
    actualScore: number;
    maxScore: number;
    color?: string;
  }[];
  selectedCategory: string | null;
}

// Performance rating calculation
const getPerformanceRating = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return "Excellent";
  if (percentage >= 60) return "Good";
  if (percentage >= 40) return "Average";
  return "Needs Improvement";
};

// Color based on percentage
const getBarColor = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return "#10b981"; // green
  if (percentage >= 60) return "#3b82f6"; // blue
  if (percentage >= 40) return "#f59e0b"; // yellow
  return "#ef4444"; // red
};

// Enhanced gradient colors for bars
const getBarGradient = (score: number, maxScore: number): { start: string; end: string } => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return { start: "#10b981", end: "#059669" }; // green gradient
  if (percentage >= 60) return { start: "#3b82f6", end: "#2563eb" }; // blue gradient
  if (percentage >= 40) return { start: "#f59e0b", end: "#d97706" }; // yellow gradient
  return { start: "#ef4444", end: "#dc2626" }; // red gradient
};

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label
}: TooltipProps<number, string> & { label: string }) => {
  if (active && payload && payload.length) {
    const { actualScore, maxScore } = payload[0].payload;
    const rating = getPerformanceRating(actualScore, maxScore);
    const percentage = Math.round((actualScore / maxScore) * 100);
    
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-lg">
        <p className="font-medium mb-1">{`${label || payload[0].payload.name}`}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-mono">{`${actualScore} / ${maxScore}`}</span>
          <span className="text-muted-foreground">•</span>
          <span className={`font-medium ${
            percentage >= 80 ? 'text-emerald-500' : 
            percentage >= 60 ? 'text-blue-500' : 
            percentage >= 40 ? 'text-amber-500' : 
            'text-red-500'
          }`}>{rating}</span>
        </div>
      </div>
    );
  }
  return null;
};

const SubcategoryBarChart = ({ data, selectedCategory }: SubcategoryBarChartProps) => {
  // Convert data for bar chart (horizontal layout)
  const chartData = data.map(item => ({
    ...item,
    // Calculate the percentage for coloring
    percentage: (item.actualScore / item.maxScore) * 100,
  }));

  return (
    <Card className="overflow-hidden border-t-4" style={{ 
      borderTopColor: data[0]?.color || "#3b82f6" 
    }}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center">
            {selectedCategory && (
              <>
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ 
                    backgroundColor: data[0]?.color || "#3b82f6" 
                  }}
                ></div>
                {selectedCategory} Subcategory Breakdown
              </>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Performance across different {selectedCategory?.toLowerCase()} topics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                barCategoryGap={8}
              >
                <defs>
                  {chartData.map((entry, index) => {
                    const colors = getBarGradient(entry.actualScore, entry.maxScore);
                    return (
                      <linearGradient 
                        key={`gradient-${index}`} 
                        id={`barGradient-${index}`} 
                        x1="0" y1="0" x2="1" y2="0"
                      >
                        <stop offset="0%" stopColor={colors.start} />
                        <stop offset="100%" stopColor={colors.end} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" opacity={0.4} />
                <XAxis 
                  type="number" 
                  domain={[0, (dataMax: number) => Math.max(10, dataMax)]} 
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                >
                  <Label 
                    value='Score' 
                    position='insideBottom' 
                    offset={-10} 
                    style={{ fill: '#64748b', fontSize: 12 }} 
                  />
                </XAxis>
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={90}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip label="" />} />
                <Bar 
                  dataKey="actualScore" 
                  radius={[0, 6, 6, 0]}
                  barSize={24}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#barGradient-${index})`} 
                      filter="drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No subcategory data available for {selectedCategory}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubcategoryBarChart;
