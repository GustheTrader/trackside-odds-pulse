
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { getRunnerColorByPosition } from './constants/postPositionColors';
import ChartTooltip from './components/ChartTooltip';
import RunnerPositionDot from './components/RunnerPositionDot';
import { createLegendFormatter } from './components/ChartLegendFormatter';

interface BettingDataPoint {
  time: string;
  volume: number;
  timestamp: number;
  isSpike?: boolean;
  runner1?: number;
  runner2?: number;
  runner3?: number;
  runner4?: number;
  runner5?: number;
  runner6?: number;
  runner7?: number;
  runner8?: number;
  runner9?: number;
  runner10?: number;
  runner11?: number;
  runner12?: number;
  runner1Odds?: number;
  runner2Odds?: number;
  runner3Odds?: number;
  runner4Odds?: number;
  runner5Odds?: number;
  runner6Odds?: number;
  runner7Odds?: number;
  runner8Odds?: number;
  runner9Odds?: number;
  runner10Odds?: number;
  runner11Odds?: number;
  runner12Odds?: number;
}

interface RunnerNamesMap {
  [key: string]: string;
}

interface RunnerColorsMap {
  [key: string]: string;
}

interface BettingTimelineProps {
  bettingData: BettingDataPoint[];
  spikes: BettingDataPoint[];
  runnerNames: RunnerNamesMap;
  runnerColors: RunnerColorsMap;
  maxVolume: number;
  maxOdds: number;
  smallText?: boolean;
}

const BettingTimeline: React.FC<BettingTimelineProps> = ({ 
  bettingData, 
  spikes, 
  runnerNames, 
  runnerColors,
  maxVolume,
  maxOdds,
  smallText = false
}) => {
  const legendFormatter = createLegendFormatter(runnerNames);

  console.log('BettingTimeline - runnerColors:', runnerColors);
  console.log('BettingTimeline - runnerNames:', runnerNames);
  console.log('BettingTimeline - sample data point:', bettingData[0]);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={bettingData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="time" 
            stroke="#cbd5e1" 
            tick={{ fill: '#cbd5e1', fontSize: smallText ? 9 : 12 }}
            height={smallText ? 15 : 30}
          />
          <YAxis 
            yAxisId="volume"
            orientation="left"
            stroke="#3B82F6" 
            tick={{ fill: '#3B82F6', fontSize: smallText ? 9 : 12 }}
            width={smallText ? 30 : 40}
            domain={[0, maxVolume * 1.2]} 
          />
          <YAxis 
            yAxisId="odds"
            orientation="right"
            stroke="#A855F7" 
            tick={{ fill: '#A855F7', fontSize: smallText ? 9 : 12 }}
            width={smallText ? 30 : 40}
            domain={[0, maxOdds * 1.2]} 
            label={{ 
              value: 'Odds', 
              angle: -90, 
              position: 'insideRight', 
              fill: '#A855F7',
              fontSize: smallText ? 10 : 12
            }}
          />
          <Tooltip 
            content={<ChartTooltip runnerNames={runnerNames} smallText={smallText} />}
          />
          <Legend 
            formatter={legendFormatter}
            wrapperStyle={{ 
              fontSize: smallText ? 9 : 12 
            }}
          />
          
          {/* Main volume line */}
          <Line 
            type="monotone" 
            dataKey="volume" 
            yAxisId="volume"
            name="volume"
            stroke="#3B82F6" 
            strokeWidth={2} 
            dot={{ r: smallText ? 2 : 3 }} 
            activeDot={{ r: smallText ? 4 : 6, fill: '#60A5FA' }} 
          />
          
          {/* Runner position lines */}
          {Object.entries(runnerColors).map(([runner, color]) => {
            const runnerNumber = parseInt(runner.replace('runner', ''));
            const standardColor = getRunnerColorByPosition(runnerNumber);
            
            return (
              <Line
                key={runner}
                type="monotone"
                dataKey={runner}
                name={runner}
                yAxisId="volume"
                stroke={standardColor}
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const value = payload[runner as keyof typeof payload];
                  if (!value) return null;
                  
                  return (
                    <RunnerPositionDot
                      key={`dot-${runner}-${cx}-${cy}`}
                      cx={cx}
                      cy={cy}
                      value={value}
                      runnerNumber={runnerNumber}
                    />
                  );
                }}
              />
            );
          })}
          
          {/* Runner odds lines - using consistent post position colors */}
          {Object.entries(runnerColors).map(([runner, color]) => {
            const runnerNumber = parseInt(runner.replace('runner', ''));
            const standardColor = getRunnerColorByPosition(runnerNumber);
            const oddsDataKey = `${runner}Odds`;
            
            console.log(`Rendering odds line for ${runner} (PP${runnerNumber}) with color ${standardColor}`);
            
            return (
              <Line
                key={`${runner}Odds`}
                type="monotone"
                dataKey={oddsDataKey}
                name={`${runner}Odds`}
                yAxisId="odds"
                stroke={standardColor}
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
            );
          })}
          
          {/* Reference lines for spikes */}
          {spikes.map((spike, index) => (
            <ReferenceLine 
              key={index} 
              x={spike.time} 
              stroke="#C084FC" 
              strokeWidth={2} 
              strokeDasharray="3 3"
              yAxisId="volume"
              label={{
                value: 'Spike',
                position: 'top',
                fill: '#C084FC',
                fontSize: smallText ? 9 : 12
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BettingTimeline;
