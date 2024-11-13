import { FC, HTMLProps, useCallback, useMemo, useState } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, Flex, NumberInput, TextInput, Title } from '@mantine/core';
import { useModals } from '@mantine/modals';
import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  SortingState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import BigNumber from 'bignumber.js';
import { useAtomValue } from 'jotai';

import {
  adminActionsColumn,
  adminAllowance,
  adminAmount,
  adminHeader,
  adminWalletBlanace,
  buyShortTokenNameColumn,
  buyerTokenNameColumn,
  exchangeBuyShortTokenNameColumn,
  exchangeOfferShortTokenNameColumn,
  idColumn,
  offerDateColumn,
  offerShortTokenNameColumn,
  offerTokenNameColumn,
  offerYieldColumn,
  priceColumn,
  priceDeltaColumn,
  sellerAddressColumn,
  yieldDeltaColumn,
} from 'src/hooks/column';
import { useTypedOffers } from 'src/hooks/offers/useTypedOffers';
import { useRole } from 'src/hooks/useRole';
import { tableOfferTypeAtom } from 'src/states';
import { USER_ROLE } from 'src/types/admin';
import { OFFER_LOADING, OFFER_TYPE, Offer } from 'src/types/offer';

import { useOffers } from '../../../hooks/interface/useOffers';
import { Table } from '../../Table';
import { MarketSort } from '../MarketSort/MarketSort';
import { MarketSubRow } from '../MarketSubRow';

export const MarketTableAdmin: FC = () => {
  const { offersAreLoading, refetch, offers: allOffers } = useOffers();

  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'offer-id', desc: false },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const { t } = useTranslation('buy', { keyPrefix: 'table' });
  const { t: t2 } = useTranslation('table', { keyPrefix: 'filters' });

  const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>(
    {}
  );

  const { role } = useRole();

  const { publicOffers, allPublicOffers } = useMemo(() => {
    const pOffers = allOffers.filter(
      (offer: Offer) =>
        !offer.buyerAddress &&
        BigNumber(offer.amount).isPositive() &&
        !BigNumber(offer.amount).isZero()
    );

    const pAllOffers = allOffers.filter(
      (offer: Offer) =>
        !offer.buyerAddress && BigNumber(offer.amount).isPositive()
    );

    return {
      publicOffers: !allOffers || offersAreLoading ? OFFER_LOADING : pOffers,
      allPublicOffers:
        !allOffers || offersAreLoading ? OFFER_LOADING : pAllOffers,
    };
  }, [allOffers, offersAreLoading]);

  const { offers } = useTypedOffers(allOffers);
  console.log('admin offers by offer type', offers.length);

  const modals = useModals();
  const { t: t3 } = useTranslation('modals');

  const deleteSelectedOffers = useCallback(() => {
    const selectedId: string[] = Array.from(Object.keys(rowSelection));

    modals.openContextModal('delete', {
      title: <Title order={3}>{t3('delete.title')}</Title>,
      size: 'lg',
      innerProps: {
        offerIds: selectedId,
        onSuccess: () => setRowSelection({}),
        isAdminDelete: true,
      },
    });
  }, [modals, offers, rowSelection, t3]);

  const checkboxColumn: ColumnDef<Offer> = useMemo(
    () => ({
      id: 'select',
      header: ({ table }) => (
        <>
          {role == USER_ROLE.ADMIN ? (
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllPageRowsSelected(),
                indeterminate: table.getIsSomePageRowsSelected(),
                onChange: table.getToggleAllPageRowsSelectedHandler(),
              }}
            />
          ) : undefined}
        </>
      ),
      cell: ({ row }) => (
        <>
          {role == USER_ROLE.ADMIN ? (
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          ) : undefined}
        </>
      ),
      size: 20,
    }),
    [role]
  );

  const sellAdminColumns: ColumnDef<Offer>[] = useMemo(
    () => [
      {
        id: 'title',
        header: ({ table }) =>
          adminHeader(
            role == USER_ROLE.ADMIN,
            table,
            rowSelection,
            deleteSelectedOffers,
            { title: t('title') }
          ),
        meta: { colSpan: 17 },
        columns: [
          checkboxColumn,
          idColumn(t, 1),
          offerShortTokenNameColumn(t, 1),
          buyerTokenNameColumn(t, 1),
          yieldDeltaColumn(t, 1),
          offerYieldColumn(t, 1),
          sellerAddressColumn(t, 1),
          priceColumn(t, 1),
          priceDeltaColumn(t, 1),
          adminAmount(t, 2),
          adminWalletBlanace(t, 2),
          adminAllowance(t, 2),
          offerDateColumn(t, 1),
          adminActionsColumn(t, 1),
        ],
      },
    ],
    [checkboxColumn, t, role, rowSelection, deleteSelectedOffers]
  );

  const buyAdminColumns: ColumnDef<Offer>[] = useMemo(
    () => [
      {
        id: 'title',
        header: ({ table }) =>
          adminHeader(
            role == USER_ROLE.ADMIN,
            table,
            rowSelection,
            deleteSelectedOffers,
            { title: t('title') }
          ),
        meta: { colSpan: 16 },
        columns: [
          checkboxColumn,
          idColumn(t, 1),
          offerTokenNameColumn(t, 1),
          buyShortTokenNameColumn(t, 1),
          yieldDeltaColumn(t, 1),
          offerYieldColumn(t, 1),
          sellerAddressColumn(t, 1),
          priceColumn(t, 1),
          priceDeltaColumn(t, 1),
          adminAmount(t, 2),
          adminWalletBlanace(t, 2),
          adminAllowance(t, 2),
          offerDateColumn(t, 1),
          adminActionsColumn(t, 1),
        ],
      },
    ],
    [checkboxColumn, t, role, rowSelection, deleteSelectedOffers]
  );

  const exchangeAdminColumns: ColumnDef<Offer>[] = useMemo(
    () => [
      {
        id: 'title',
        header: ({ table }) =>
          adminHeader(
            role == USER_ROLE.ADMIN,
            table,
            rowSelection,
            deleteSelectedOffers,
            { title: t('title') }
          ),
        meta: { colSpan: 16 },
        columns: [
          checkboxColumn,
          idColumn(t, 1),
          exchangeOfferShortTokenNameColumn(t, 1),
          exchangeBuyShortTokenNameColumn(t, 1),
          sellerAddressColumn(t, 1),
          priceColumn(t, 1),
          adminAmount(t, 2),
          adminWalletBlanace(t, 2),
          adminAllowance(t, 2),
          offerDateColumn(t, 1),
          adminActionsColumn(t, 1),
        ],
      },
    ],
    [checkboxColumn, t, role, rowSelection, deleteSelectedOffers]
  );

  const sortingType = useAtomValue(tableOfferTypeAtom);

  // const
  const rightColumn: ColumnDef<Offer>[] = useMemo(() => {
    switch (sortingType) {
      case OFFER_TYPE.SELL:
        return sellAdminColumns;
      case OFFER_TYPE.BUY:
        return buyAdminColumns;
      case OFFER_TYPE.EXCHANGE:
        return exchangeAdminColumns;
      default:
        return sellAdminColumns;
    }
  }, [sortingType, sellAdminColumns, buyAdminColumns, exchangeAdminColumns]);

  const [offerLimit, setOfferLimit] = useState<number | undefined>(undefined);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [filterZeroAmount, setFilterZeroAmount] = useState<boolean>(false);
  const limitOffers = useMemo(() => {
    let o = offers;
    if (filterZeroAmount) {
      o = o.filter((offer) => BigNumber(offer.amount).isZero());
    }
    if (offerLimit && offerLimit > 0) {
      o = o.slice(0, offerLimit);
    }
    return o;
  }, [offers, offerLimit, filterZeroAmount]);

  const table = useReactTable({
    data: limitOffers,
    columns: rightColumn,
    filterFns: {},
    state: {
      sorting,
      pagination,
      expanded,
      rowSelection,
      globalFilter,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getRowId: (row) => row.offerId,
    meta: {
      colSpan: 15,
    },
  });

  return (
    <Flex direction={'column'} gap={'sm'} align={'flex-start'} mt={20}>
      <TextInput
        placeholder={t2('nameFilterPlaceholder')}
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.currentTarget.value)}
      />
      <Flex direction={'column'} gap={'md'}>
        <MarketSort />
        <Flex gap={'md'} align={'end'}>
          <NumberInput
            label={'Offer shown (nothing for all)'}
            min={0}
            max={offers.length}
            value={offerLimit}
            onChange={(value) =>
              value ? setOfferLimit(Number(value)) : setOfferLimit(undefined)
            }
          />
          <Checkbox
            label={'Offers with available amount = 0'}
            checked={filterZeroAmount}
            onChange={() => setFilterZeroAmount(!filterZeroAmount)}
          />
        </Flex>
      </Flex>
      <Table
        tableProps={{
          highlightOnHover: true,
          verticalSpacing: 'sm',
          horizontalSpacing: 'xs',
        }}
        table={table}
        tablecaptionOptions={{
          refreshState: [offersAreLoading, refetch],
          visible: true,
        }}
        TableSubRow={MarketSubRow}
      />
    </Flex>
  );
};

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <div>
      <input
        type={'checkbox'}
        ref={ref}
        className={className + ' cursor-pointer'}
        {...rest}
      />
    </div>
  );
}
