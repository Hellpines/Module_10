import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import style from './noteschart.module.css';
import { NotesChartProps } from '../../../types/props/NotesChartProps';

function NotesChart({ data }: NotesChartProps) {
    return (
        <div className={style.chartContainer}>
            <div className={style.chartWrapper}>
                <ResponsiveContainer width='100%' height={300}>
                    <LineChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid stroke='var(--border-color)' vertical={false} />
                        <XAxis
                            dataKey='name'
                            tick={{
                                fill: 'var(--text-secondary)',
                                fontSize: '0.5rem',
                            }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{
                                fill: 'var(--text-secondary)',
                                fontSize: '0.75rem',
                            }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                            }}
                        />
                        <Line
                            type='monotone'
                            dataKey='active'
                            stroke='var(--text-primary)'
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type='monotone'
                            dataKey='archived'
                            stroke='#ef4444'
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type='monotone'
                            dataKey='trash'
                            stroke='#8b5cf6'
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default NotesChart;
