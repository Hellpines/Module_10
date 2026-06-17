'use client';

import { useTranslation } from 'react-i18next';
import { StatisticsCardProps } from '../../types/props/StatisticsCardProps';
import style from './statisticscard.module.css';

export default function StatisticsCard({ title, value, percent }: StatisticsCardProps) {
    const { t } = useTranslation();

    return (
        <div className={style.statisticsCard}>
            <p className={style.title}>{title}</p>
            <p className={style.value}>{value}</p>
            <p className={style.info}>{t('profile.monthOverMonth', { percent })}</p>
        </div>
    );
}
