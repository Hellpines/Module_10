'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TableProps } from '../../../types/props/TableProps';

const TableContainer = styled.div`
    flex: 1;
    min-width: 0;
`;

const TableWrapper = styled.div`
    max-width: 500px;
    width: 100%;
    height: 100%;
    background-color: var(--bg-profile);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-m);
    padding: var(--padding-12);
    box-shadow: 0px 4px 12px 0px #0000000a;
    overflow-x: auto;
`;

const StatsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableRow = styled.tr`
    &:last-child td {
        border-bottom: none;
    }
`;

const TableHeader = styled.th`
    font-weight: 600;
    color: var(--text-secondary);
    padding: var(--padding-12);
    border-bottom: 1px solid var(--border-color);

    &:first-child {
        text-align: left;
    }
`;

const TableCell = styled.td`
    padding: var(--padding-12);
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
    text-align: center;
`;

const MonthCell = styled(TableCell)`
    text-align: left;
    font-weight: 500;
`;

const EmptyCell = styled(TableCell)`
    text-align: center;
    padding: 20px;
`;

const Table: React.FC<TableProps> = ({ data }) => {
    const { t } = useTranslation();

    return (
        <TableContainer>
            <TableWrapper>
                <StatsTable>
                    <thead>
                        <TableRow>
                            <TableHeader>{t('profile.tableMonth')}</TableHeader>
                            <TableHeader>{t('profile.tableCreated')}</TableHeader>
                            <TableHeader>{t('profile.tableArchived')}</TableHeader>
                            <TableHeader>{t('profile.tableDeleted')}</TableHeader>
                        </TableRow>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row) => (
                                <TableRow key={row.monthSortKey}>
                                    <MonthCell>{row.name}</MonthCell>
                                    <TableCell>{row.active}</TableCell>
                                    <TableCell>{row.archived}</TableCell>
                                    <TableCell>{row.trash}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <EmptyCell colSpan={4}>{t('profile.noData')}</EmptyCell>
                            </TableRow>
                        )}
                    </tbody>
                </StatsTable>
            </TableWrapper>
        </TableContainer>
    );
};

export default Table;
