import { AlertModal } from '@/components/shared/alert-modal';
import DataTable from '../../components/shared/data-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import Heading from '@/components/shared/heading';
import PopupModal from '@/components/shared/popup-modal';
import { Button } from '@/components/ui/button';
import { paymentService } from '../../services/payment';
import { TPayment, TPaymentCreate } from '@/types/payment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { PaymentForm } from '../../components/payment/payment-form';
import EditModal from '@/components/shared/edit-modal';
import { format } from 'date-fns';
import { pesananService } from '@/services/pesanan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentPage() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editData, setEditData] = useState<TPayment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: payment, isLoading } = useQuery({
    queryKey: ['payment'],
    queryFn: paymentService.getAll
  });

  const { data: pesanan } = useQuery({
    queryKey: ['pesanan'],
    queryFn: pesananService.getAll
  });

  const createMutation = useMutation({
    mutationFn: paymentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TPaymentCreate }) =>
      paymentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
      setEditData(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: paymentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
      setDeleteId(null);
    }
  });

  const totalPayment =
    payment?.reduce((acc, curr) => acc + curr.jumlah, 0) || 0;

  const columns: ColumnDef<TPayment>[] = [
    {
      accessorKey: 'id',
      header: 'Payment id'
    },
    {
      accessorKey: 'metode',
      header: 'Metode payment'
    },
    {
      accessorKey: 'status',
      header: 'Status payment'
    },
    {
      accessorKey: 'transaksi_id',
      header: 'transaksi id'
    },
    {
      accessorKey: 'jumlah',
      header: 'jumlah payment'
    },
    {
      accessorKey: 'tanggal',
      header: 'Tanggal',
      cell: ({ row }) => {
        const rawValue = row.getValue('tanggal');

        if (!rawValue || typeof rawValue !== 'string') {
          return '-';
        }

        const date = new Date(rawValue);
        if (isNaN(date.getTime())) {
          return '-';
        }

        return format(date, 'yyyy-MM-dd HH:mm:ss');
      }
    },
    {
      accessorKey: 'midtrans_order_id',
      header: 'midtrans order id'
    },
    {
      accessorKey: 'snap_token',
      header: 'snap token'
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
        <Heading title="Pembayaran" description="Kelola data pembayaran" />
        <PopupModal
          renderModal={(onClose) => (
            <div className="p-6">
              <Heading
                title="Tambah Pembayaran"
                description="Tambah data pembayaran baru"
              />
              <PaymentForm
                onSubmit={async (data) => {
                  await createMutation.mutateAsync(data);
                  onClose();
                }}
                loading={createMutation.isPending}
                pesanan={pesanan || []}
              />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pembayaran
            </CardTitle>
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
                : `Rp ${totalPayment.toLocaleString('id-ID')}`}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={payment || []} />

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
            <Heading
              title="Edit Pembayaran"
              description="Edit data Pembayaran"
            />
            <PaymentForm
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
              pesanan={pesanan || []}
            />
          </div>
        </EditModal>
      )}
    </div>
  );
}
