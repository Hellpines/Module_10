import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import NotesChart from './NotesChart';
import { ChartDataItem } from '../../../types/chart/ChartDataItem';
import { NotesChartProps } from '../../../types/props/NotesChartProps';

interface MockResponsiveContainerProps {
    children: ReactNode;
    height: number | string;
}

interface MockLineChartProps {
    children: ReactNode;
    data: ChartDataItem[];
    margin: Record<string, number>;
}

interface MockLineProps {
    dataKey: string;
    stroke: string;
    type: string;
    strokeWidth: number;
    dot: boolean;
    activeDot: { r: number };
}

interface MockXAxisProps {
    dataKey: string;
    axisLine: boolean;
    tickLine: boolean;
}

interface MockYAxisProps {
    axisLine: boolean;
    tickLine: boolean;
}

interface MockCartesianGridProps {
    stroke: string;
    vertical: boolean;
}

interface MockTooltipProps {
    contentStyle: Record<string, string | number>;
}

jest.mock('recharts', () => ({
    ResponsiveContainer: function MockResponsiveContainer({
        children,
        height,
    }: MockResponsiveContainerProps) {
        return (
            <div data-testid='mock-responsive-container' data-height={height}>
                {children}
            </div>
        );
    },
    LineChart: function MockLineChart({ children, data, margin }: MockLineChartProps) {
        return (
            <div
                data-testid='mock-line-chart'
                data-data={JSON.stringify(data)}
                data-margin={JSON.stringify(margin)}
            >
                {children}
            </div>
        );
    },
    Line: function MockLine({ dataKey, stroke, type, strokeWidth, dot, activeDot }: MockLineProps) {
        return (
            <div
                data-testid={`mock-line-${dataKey}`}
                data-stroke={stroke}
                data-type={type}
                data-strokewidth={strokeWidth}
                data-dot={String(dot)}
                data-activedot={JSON.stringify(activeDot)}
            />
        );
    },
    XAxis: function MockXAxis({ dataKey, axisLine, tickLine }: MockXAxisProps) {
        return (
            <div
                data-testid='mock-x-axis'
                data-key={dataKey}
                data-axisline={String(axisLine)}
                data-tickline={String(tickLine)}
            />
        );
    },
    YAxis: function MockYAxis({ axisLine, tickLine }: MockYAxisProps) {
        return (
            <div
                data-testid='mock-y-axis'
                data-axisline={String(axisLine)}
                data-tickline={String(tickLine)}
            />
        );
    },
    CartesianGrid: function MockCartesianGrid({ stroke, vertical }: MockCartesianGridProps) {
        return (
            <div
                data-testid='mock-cartesian-grid'
                data-stroke={stroke}
                data-vertical={String(vertical)}
            />
        );
    },
    Tooltip: function MockTooltip({ contentStyle }: MockTooltipProps) {
        return <div data-testid='mock-tooltip' data-style={JSON.stringify(contentStyle)} />;
    },
}));

describe('NotesChart Component', () => {
    let sampleData: ChartDataItem[];
    let defaultProps: NotesChartProps;

    beforeEach(() => {
        sampleData = [
            { monthSortKey: '2026-01', name: 'Jan', active: 12, archived: 4, trash: 2 },
            { monthSortKey: '2026-02', name: 'Feb', active: 19, archived: 3, trash: 5 },
            { monthSortKey: '2026-03', name: 'Mar', active: 15, archived: 8, trash: 1 },
        ];
        defaultProps = {
            data: sampleData,
        };
    });

    test('wraps chart contents inside a fluid layout container structure', () => {
        render(<NotesChart {...defaultProps} />);

        const container = screen.getByTestId('mock-responsive-container');
        expect(container).not.toBeNull();
        expect(container.getAttribute('data-height')).toBe('300');
    });

    test('forwards accurate historical record tracking datasets down to the line chart compiler', () => {
        render(<NotesChart {...defaultProps} />);

        const chartElement = screen.getByTestId('mock-line-chart');
        expect(chartElement).not.toBeNull();

        const passedData = JSON.parse(chartElement.getAttribute('data-data') || '[]');
        expect(passedData).toHaveLength(3);
        expect(passedData[0].name).toBe('Jan');
        expect(passedData[1].active).toBe(19);
    });

    test('configures axis rendering systems with customized styling overrides', () => {
        render(<NotesChart {...defaultProps} />);

        const xAxis = screen.getByTestId('mock-x-axis');
        const yAxis = screen.getByTestId('mock-y-axis');

        expect(xAxis.getAttribute('data-key')).toBe('name');
        expect(xAxis.getAttribute('data-axisline')).toBe('false');
        expect(xAxis.getAttribute('data-tickline')).toBe('false');

        expect(yAxis.getAttribute('data-axisline')).toBe('false');
        expect(yAxis.getAttribute('data-tickline')).toBe('false');
    });

    test('mounts structural layout utilities including background grids and tooltips', () => {
        render(<NotesChart {...defaultProps} />);

        const grid = screen.getByTestId('mock-cartesian-grid');
        const tooltip = screen.getByTestId('mock-tooltip');

        expect(grid.getAttribute('data-vertical')).toBe('false');
        expect(tooltip).not.toBeNull();
    });

    test('defines visualization metrics for active, archived, and deleted notes categories', () => {
        render(<NotesChart {...defaultProps} />);

        const activeLine = screen.getByTestId('mock-line-active');
        const archivedLine = screen.getByTestId('mock-line-archived');
        const trashLine = screen.getByTestId('mock-line-trash');

        expect(activeLine.getAttribute('data-stroke')).toBe('var(--text-primary)');
        expect(activeLine.getAttribute('data-type')).toBe('monotone');
        expect(activeLine.getAttribute('data-strokewidth')).toBe('2.5');

        expect(archivedLine.getAttribute('data-stroke')).toBe('#ef4444');
        expect(archivedLine.getAttribute('data-dot')).toBe('false');

        expect(trashLine.getAttribute('data-stroke')).toBe('#8b5cf6');
        expect(JSON.parse(trashLine.getAttribute('data-activedot') || '{}')).toEqual({ r: 6 });
    });
});
