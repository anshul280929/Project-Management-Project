import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import StackedBarChartRoundedIcon from '@mui/icons-material/StackedBarChartRounded';
import PieChartOutlineRoundedIcon from '@mui/icons-material/PieChartOutlineRounded';
import { WorkflowStatus, type Story } from '../../types';
import './StatusChart.css';

type ChartType = 'donut' | 'bar' | 'stacked';

interface StatusData {
  label: string;
  count: number;
  points: number;
  color: string;
  status: WorkflowStatus;
}

interface StatusChartProps {
  stories: Story[];
}

/* ─────────────────────────────────────────────────────────
 *  Tooltip Component
 * ───────────────────────────────────────────────────────── */
const ChartTooltip: React.FC<{
  visible: boolean;
  x: number;
  y: number;
  title: string;
  detail: string;
}> = ({ visible, x, y, title, detail }) => (
  <div
    className={`chart-tooltip ${visible ? 'visible' : ''}`}
    style={{ left: x + 12, top: y - 10 }}
  >
    <div className="chart-tooltip-title">{title}</div>
    <div className="chart-tooltip-detail">{detail}</div>
  </div>
);

/* ─────────────────────────────────────────────────────────
 *  Donut Chart
 * ───────────────────────────────────────────────────────── */
const DonutChart: React.FC<{
  data: StatusData[];
  total: number;
  hoveredIndex: number | null;
  onHover: (index: number | null, e?: React.MouseEvent) => void;
  onClick: (status: WorkflowStatus) => void;
}> = ({ data, total, hoveredIndex, onHover, onClick }) => {
  const size = 180;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  // Build segments
  let cumulativeOffset = 0;
  const segments = data.map((item, i) => {
    const proportion = total > 0 ? item.count / total : 0;
    const segmentLength = proportion * circumference;
    const dashArray = `${segmentLength} ${circumference - segmentLength}`;
    const dashOffset = -cumulativeOffset;
    cumulativeOffset += segmentLength;

    return (
      <circle
        key={item.label}
        className={`donut-segment ${hoveredIndex !== null && hoveredIndex !== i ? 'dimmed' : ''}`}
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={item.color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        strokeLinecap="butt"
        transform={`rotate(-90 ${cx} ${cy})`}
        onMouseEnter={(e) => onHover(i, e)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick(item.status)}
      />
    );
  });

  // Hovered item for center label
  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="donut-chart-wrapper">
      <svg
        className="donut-chart-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        {segments}
      </svg>
      <div className="donut-center-label">
        <div className="donut-center-count">
          {hoveredItem ? hoveredItem.count : total}
        </div>
        <div className="donut-center-text">
          {hoveredItem ? hoveredItem.label : 'Total'}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
 *  Bar Chart
 * ───────────────────────────────────────────────────────── */
const BarChart: React.FC<{
  data: StatusData[];
  maxCount: number;
  hoveredIndex: number | null;
  onHover: (index: number | null, e?: React.MouseEvent) => void;
  onClick: (status: WorkflowStatus) => void;
}> = ({ data, maxCount, hoveredIndex, onHover, onClick }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bar-chart-wrapper">
      {data.map((item, i) => {
        const widthPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
        return (
          <div
            key={item.label}
            className={`bar-chart-row ${hoveredIndex !== null && hoveredIndex !== i ? 'dimmed' : ''}`}
            onMouseEnter={(e) => onHover(i, e)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(item.status)}
          >
            <span className="bar-chart-label">{item.label}</span>
            <div className="bar-chart-track">
              <div
                className="bar-chart-fill"
                style={{
                  width: animated ? `${Math.max(widthPercent, item.count > 0 ? 8 : 0)}%` : '0%',
                  backgroundColor: item.color,
                }}
              >
                <span className={`bar-chart-fill-text ${animated && widthPercent > 15 ? 'visible' : ''}`}>
                  {item.points}pts
                </span>
              </div>
            </div>
            <span className="bar-chart-value">{item.count}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
 *  Stacked Bar Chart
 * ───────────────────────────────────────────────────────── */
const StackedBarChart: React.FC<{
  data: StatusData[];
  total: number;
  hoveredIndex: number | null;
  onHover: (index: number | null, e?: React.MouseEvent) => void;
  onClick: (status: WorkflowStatus) => void;
}> = ({ data, total, hoveredIndex, onHover, onClick }) => {
  return (
    <div className="stacked-bar-wrapper">
      <div className="stacked-bar-track">
        {data.map((item, i) => {
          const proportion = total > 0 ? item.count / total : 0;
          return (
            <div
              key={item.label}
              className={`stacked-bar-segment ${hoveredIndex !== null && hoveredIndex !== i ? 'dimmed' : ''}`}
              style={{
                flex: proportion,
                backgroundColor: item.color,
              }}
              onMouseEnter={(e) => onHover(i, e)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onClick(item.status)}
            >
              {proportion > 0.12 && (
                <span className="stacked-bar-segment-label">{item.count}</span>
              )}
            </div>
          );
        })}
      </div>
      {/* Labels below the bar */}
      <div className="stacked-bar-labels-row">
        {data.map((item, i) => {
          const proportion = total > 0 ? item.count / total : 0;
          return (
            <div
              key={item.label}
              className={`stacked-bar-label-item ${hoveredIndex !== null && hoveredIndex !== i ? 'dimmed' : ''}`}
              style={{ flex: proportion }}
            >
              <span className="stacked-bar-label-name">{item.label}</span>
              <span className="stacked-bar-label-value">{item.points} pts</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
 *  Legend (used alongside donut chart)
 * ───────────────────────────────────────────────────────── */
const ChartLegend: React.FC<{
  data: StatusData[];
  hoveredIndex: number | null;
  onHover: (index: number | null, e?: React.MouseEvent) => void;
  onClick: (status: WorkflowStatus) => void;
}> = ({ data, hoveredIndex, onHover, onClick }) => (
  <div className="chart-legend">
    {data.map((item, i) => (
      <div
        key={item.label}
        className={`chart-legend-item ${hoveredIndex !== null && hoveredIndex !== i ? 'dimmed' : ''}`}
        onMouseEnter={(e) => onHover(i, e)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick(item.status)}
      >
        <span className="chart-legend-dot" style={{ backgroundColor: item.color }} />
        <span className="chart-legend-label">{item.label}</span>
        <span className="chart-legend-count">{item.count}</span>
        <span className="chart-legend-points">({item.points} pts)</span>
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────
 *  Main StatusChart Component
 * ───────────────────────────────────────────────────────── */
export const StatusChart: React.FC<StatusChartProps> = ({ stories }) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [chartType, setChartType] = useState<ChartType>('donut');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Build status data
  const statusData: StatusData[] = [
    {
      label: 'Backlog',
      count: stories.filter((s) => s.status === WorkflowStatus.BACKLOG).length,
      points: stories.filter((s) => s.status === WorkflowStatus.BACKLOG).reduce((a, s) => a + s.storyPoints, 0),
      color: '#64748b',
      status: WorkflowStatus.BACKLOG,
    },
    {
      label: 'In Progress',
      count: stories.filter((s) => s.status === WorkflowStatus.IN_PROGRESS).length,
      points: stories.filter((s) => s.status === WorkflowStatus.IN_PROGRESS).reduce((a, s) => a + s.storyPoints, 0),
      color: '#0284c7',
      status: WorkflowStatus.IN_PROGRESS,
    },
    {
      label: 'Testing',
      count: stories.filter((s) => s.status === WorkflowStatus.TESTING).length,
      points: stories.filter((s) => s.status === WorkflowStatus.TESTING).reduce((a, s) => a + s.storyPoints, 0),
      color: '#d97706',
      status: WorkflowStatus.TESTING,
    },
    {
      label: 'Done',
      count: stories.filter((s) => s.status === WorkflowStatus.DONE).length,
      points: stories.filter((s) => s.status === WorkflowStatus.DONE).reduce((a, s) => a + s.storyPoints, 0),
      color: '#16a34a',
      status: WorkflowStatus.DONE,
    },
  ];

  const totalCount = statusData.reduce((a, d) => a + d.count, 0);
  const maxCount = Math.max(...statusData.map((d) => d.count), 1);

  const handleChartTypeChange = (_: React.MouseEvent<HTMLElement>, newType: ChartType | null) => {
    if (newType !== null) {
      setChartType(newType);
      setHoveredIndex(null);
    }
  };

  const handleHover = useCallback((index: number | null, e?: React.MouseEvent) => {
    setHoveredIndex(index);
    if (e) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleClick = useCallback(
    (status: WorkflowStatus) => {
      if (!projectId) return;
      navigate(`/project/${projectId}/board?status=${encodeURIComponent(status)}`);
    },
    [navigate, projectId]
  );

  // Track mouse for tooltip positioning
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (hoveredIndex !== null) {
        setTooltipPos({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredIndex]);

  const hoveredItem = hoveredIndex !== null ? statusData[hoveredIndex] : null;

  return (
    <Card className="status-chart-card" ref={containerRef}>
      <Box className="status-chart-card-accent-bar" />

      {/* Header with title and toggle */}
      <div className="status-chart-header">
        <Typography className="status-chart-title">
          Status Distribution
        </Typography>
        <ToggleButtonGroup
          className="chart-toggle-group"
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
        >
          <ToggleButton value="donut">
            <DonutLargeRoundedIcon sx={{ fontSize: 14, mr: 0.5 }} />
            Donut
          </ToggleButton>
          <ToggleButton value="bar">
            <BarChartRoundedIcon sx={{ fontSize: 14, mr: 0.5 }} />
            Bar
          </ToggleButton>
          <ToggleButton value="stacked">
            <StackedBarChartRoundedIcon sx={{ fontSize: 14, mr: 0.5 }} />
            Stacked
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* Chart Body */}
      {totalCount === 0 ? (
        <div className="chart-empty-state">
          <PieChartOutlineRoundedIcon className="chart-empty-icon" />
          <Typography className="chart-empty-text">
            No stories yet — create your first story to see the chart
          </Typography>
        </div>
      ) : (
        <div className="status-chart-body">
          {chartType === 'donut' && (
            <>
              <DonutChart
                data={statusData}
                total={totalCount}
                hoveredIndex={hoveredIndex}
                onHover={handleHover}
                onClick={handleClick}
              />
              <ChartLegend
                data={statusData}
                hoveredIndex={hoveredIndex}
                onHover={handleHover}
                onClick={handleClick}
              />
            </>
          )}

          {chartType === 'bar' && (
            <BarChart
              data={statusData}
              maxCount={maxCount}
              hoveredIndex={hoveredIndex}
              onHover={handleHover}
              onClick={handleClick}
            />
          )}

          {chartType === 'stacked' && (
            <StackedBarChart
              data={statusData}
              total={totalCount}
              hoveredIndex={hoveredIndex}
              onHover={handleHover}
              onClick={handleClick}
            />
          )}
        </div>
      )}

      {/* Floating Tooltip */}
      <ChartTooltip
        visible={hoveredItem !== null}
        x={tooltipPos.x}
        y={tooltipPos.y}
        title={hoveredItem?.label ?? ''}
        detail={hoveredItem ? `${hoveredItem.count} stories · ${hoveredItem.points} story points` : ''}
      />
    </Card>
  );
};

export default StatusChart;
