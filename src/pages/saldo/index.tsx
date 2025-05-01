import { AlertModal } from '@/components/shared/alert-modal';
import DataTable from '../../components/shared/data-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import Heading from '@/components/shared/heading';
import PopupModal from '@/components/shared/popup-modal';
import { Button } from '@/components/ui/button';
import { saldoService } from '../../services/saldo';
import { TSaldo, TSaldoCreate } from '@/types/saldo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { SaldoForm } from '../../components/saldo/saldo-form';
import EditModal from '@/components/shared/edit-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default function SaldoPage() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editData, setEditData] = useState<TSaldo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: saldo, isLoading } = useQuery({
    queryKey: ['saldo'],
    queryFn: saldoService.getAll
  });

  const createMutation = useMutation({
    mutationFn: saldoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saldo'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TSaldoCreate }) =>
      saldoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saldo'] });
      setEditData(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: saldoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saldo'] });
      setDeleteId(null);
    }
  });

  const columns: ColumnDef<TSaldo>[] = [
    {
      accessorKey: 'keterangan',
      header: 'Keterangan Saldo'
    },
    {
      accessorKey: 'jumlah',
      header: 'Jumlah Saldo'
    },
    {
      accessorKey: 'tanggal',
      header: 'Tanggal',
      cell: ({ row }) => {
        const rawValue = row.getValue('tanggal');

        if (!rawValue || typeof rawValue !== 'string') {
          return '-'; // Kalau bukan string valid, kasih strip
        }

        const date = new Date(rawValue);
        if (isNaN(date.getTime())) {
          return '-'; // Kalau bukan tanggal valid
        }

        return format(date, 'yyyy-MM-dd HH:mm:ss');
      }
    },
    {
      accessorKey: 'payment_id',
      header: 'Payment Id'
    },
    {
      accessorKey: 'pengeluaran_id',
      header: 'Pengeluaran Id'
    },
    {
      accessorKey: 'tipe',
      header: 'Tipe Saldo'
    },

    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditData(row.original);
              setIsEditModalOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) return <DataTableSkeleton columnCount={3} />;

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <Heading title="Saldo" description="Kelola data Saldo" />
        <PopupModal
          renderModal={(onClose) => (
            <div className="p-6">
              <Heading
                title="Tambah Saldo"
                description="Tambah data Saldo baru"
              />
              <SaldoForm
                onSubmit={async (data) => {
                  await createMutation.mutateAsync(data);
                  onClose();
                }}
                loading={createMutation.isPending}
              />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saldo</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? 'Loading...'
                : `Rp ${saldo?.total.toLocaleString('id-ID')}`}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={saldo?.data || []} />

      <AlertModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />

      {editData && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditData(null);
          }}
        >
          <div className="p-6">
            <Heading title="Edit Saldo" description="Edit data Saldo" />
            <SaldoForm
              initialData={editData}
              onSubmit={async (data) => {
                await updateMutation.mutateAsync({
                  id: editData.id,
                  data
                });
                setIsEditModalOpen(false);
                setEditData(null);
              }}
              loading={updateMutation.isPending}
            />
          </div>
        </EditModal>
      )}
    </div>
  );
}
