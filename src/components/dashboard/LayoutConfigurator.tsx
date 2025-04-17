import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sofa } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutConfig {
  rows: number;
  columns: number;
  gap: number;
  showNumbers: boolean;
  showStatus: boolean;
  layout: boolean[][]; // true for seat, false for empty space
}

interface LayoutConfiguratorProps {
  onSave: (config: LayoutConfig) => void;
  initialConfig?: LayoutConfig;
}

const LayoutConfigurator = ({ onSave, initialConfig }: LayoutConfiguratorProps) => {
  const [config, setConfig] = useState<LayoutConfig>(initialConfig || {
    rows: 14,
    columns: 7,
    gap: 2,
    showNumbers: true,
    showStatus: true,
    layout: Array(14).fill(null).map(() => Array(7).fill(true))
  });

  const handleGridClick = (row: number, col: number) => {
    const newLayout = [...config.layout];
    newLayout[row][col] = !newLayout[row][col];
    setConfig({ ...config, layout: newLayout });
  };

  const handleSave = () => {
    onSave(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Library Layout Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grid Size Configuration */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rows">Number of Rows</Label>
              <Input
                id="rows"
                type="number"
                min="1"
                max="20"
                value={config.rows}
                onChange={(e) => setConfig({ ...config, rows: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="columns">Number of Columns</Label>
              <Input
                id="columns"
                type="number"
                min="1"
                max="10"
                value={config.columns}
                onChange={(e) => setConfig({ ...config, columns: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gap">Grid Gap (px)</Label>
            <Slider
              id="gap"
              min={1}
              max={10}
              step={1}
              value={[config.gap]}
              onValueChange={([value]) => setConfig({ ...config, gap: value })}
            />
          </div>
        </div>

        {/* Display Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="showNumbers"
              checked={config.showNumbers}
              onCheckedChange={(checked) => setConfig({ ...config, showNumbers: checked })}
            />
            <Label htmlFor="showNumbers">Show Seat Numbers</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="showStatus"
              checked={config.showStatus}
              onCheckedChange={(checked) => setConfig({ ...config, showStatus: checked })}
            />
            <Label htmlFor="showStatus">Show Seat Status</Label>
          </div>
        </div>

        {/* Interactive Grid */}
        <div className="space-y-2">
          <Label>Click to toggle seats (green = seat, white = empty)</Label>
          <div 
            className="grid gap-2 p-4 border rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))`,
              gap: `${config.gap}px`
            }}
          >
            {Array.from({ length: config.rows }).map((_, rowIndex) => (
              Array.from({ length: config.columns }).map((_, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "aspect-square flex items-center justify-center cursor-pointer transition-colors",
                    config.layout[rowIndex]?.[colIndex] 
                      ? "bg-green-100 hover:bg-green-200" 
                      : "bg-white hover:bg-gray-100"
                  )}
                  onClick={() => handleGridClick(rowIndex, colIndex)}
                >
                  {config.layout[rowIndex]?.[colIndex] && (
                    <Sofa className="w-6 h-6 text-green-600" />
                  )}
                </div>
              ))
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Layout</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayoutConfigurator; 