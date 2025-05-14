import { AlertModal } from '@/components/shared/alert-modal';
import DataTable from '../../components/shared/data-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import { pesananService } from '../../services/pesanan';
import { TPesanan, TPesananCreate } from '@/types/pesanan';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { PesananForm } from '../../components/pesanan/pesanan-form';
import EditModal from '@/components/shared/edit-modal';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

export default function PesananPage() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editData, setEditData] = useState<TPesanan | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<TPesanan | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: pesanan, isLoading } = useQuery({
    queryKey: ['pesanan'],
    queryFn: pesananService.getAll
  });

  const { data: detailPesanan } = useQuery({
    queryKey: ['pesanan-detail', selectedId],
    queryFn: () => pesananService.getById(selectedId!),
    enabled: !!selectedId
  });

  useEffect(() => {
    if (detailPesanan) {
      setSelectedDetail(detailPesanan);
    }
  }, [detailPesanan]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TPesananCreate }) =>
      pesananService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pesanan'] });
      setEditData(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: pesananService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pesanan'] });
      setDeleteId(null);
    }
  });

  const sumPesanan =
    pesanan?.reduce((acc, pesananItems) => {
      const totalSubtotal = pesananItems.pesanan_items.reduce(
        (subTotalAcc, item) => subTotalAcc + item.subtotal,
        0
      );
      return acc + totalSubtotal;
    }, 0) || 0;

  const columns: ColumnDef<TPesanan>[] = [
    {
      accessorKey: 'id',
      header: 'Id Pesanan'
    },
    {
      accessorKey: 'status',
      header: 'Status Pesanan'
    },
    {
      accessorKey: 'users.first_name',
      header: 'Nama Awal Pengguna'
    },
    {
      accessorKey: 'users.last_name',
      header: 'Nama Akhir Pengguna'
    },
    {
      accessorKey: 'users.phone',
      header: 'Nomor Telepon Pengguna'
    },
    {
      accessorKey: 'users.email',
      header: 'Email Pengguna'
    },
    {
      accessorKey: 'address',
      header: 'Alamat Pemesan'
    },
    {
      accessorKey: 'created_at',
      header: 'Tanggal',
      cell: ({ row }) => {
        const rawValue = row.getValue('created_at');

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
      id: 'subtotal',
      header: 'Subtotal Pesanan',
      cell: ({ row }) => {
        const items = row.original.pesanan_items;
        const subtotal =
          items?.reduce((acc, item) => acc + item.subtotal, 0) || 0;
        return `Rp ${subtotal.toLocaleString('id-ID')}`;
      }
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedId(row.original.id);
              setIsDetailOpen(true);
            }}
          >
            👁️ {/* atau bisa ganti dengan ikon dari Lucide */}
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) return <DataTableSkeleton columnCount={3} />;

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <Heading title="Pesanan" description="Kelola data pesanan" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Masuk Pesanan
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
                : `Rp ${sumPesanan.toLocaleString('id-ID')}`}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={pesanan || []} />

      <AlertModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />

      {selectedDetail && (
        <EditModal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedId(null);
            setSelectedDetail(null);
          }}
        >
          <div className="space-y-4 p-6">
            <Heading
              title="Detail Pesanan"
              description={`Pesanan ID: ${selectedDetail.id}`}
            />
            <p>
              <strong>Status:</strong> {selectedDetail.status}
            </p>
            <p>
              <strong>Alamat:</strong> {selectedDetail.address}
            </p>
            <p>
              <strong>Pengguna:</strong> {selectedDetail.users.first_name}{' '}
              {selectedDetail.users.last_name}
            </p>
            <p>
              <strong>No. Telepon:</strong> {selectedDetail.users.phone}
            </p>

            <div className="space-y-2">
              {selectedDetail.pesanan_items.map((item, idx) => (
                <div key={idx} className="rounded border p-2 shadow-sm">
                  <img
                    src={item.menu.image}
                    alt={item.menu.nama}
                    className="mb-2 h-20 w-20 object-cover"
                  />
                  <p>
                    <strong>Menu:</strong> {item.menu.nama} (
                    {item.menu.kategori})
                  </p>
                  <p>
                    <strong>Jumlah:</strong> {item.jumlah}
                  </p>
                  <p>
                    <strong>Subtotal:</strong> Rp{' '}
                    {item.subtotal.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </EditModal>
      )}

      {editData && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditData(null);
          }}
        >
          <div className="p-6">
            <Heading title="Edit Pesanan" description="Edit data Pesanan" />
            <PesananForm
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
