import { AlertModal } from '@/components/shared/alert-modal';
import DataTable from '../../components/shared/data-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import Heading from '@/components/shared/heading';
import PopupModal from '@/components/shared/popup-modal';
import { Button } from '@/components/ui/button';
import { pengeluaranService } from '../../services/pengeluaran';
import { TPengeluaran, TPengeluaranCreate } from '@/types/pengeluaran';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { PengeluaranForm } from '../../components/pengeluaran/pengeluaran-form';
import EditModal from '@/components/shared/edit-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PengeluaranPage() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editData, setEditData] = useState<TPengeluaran | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: pengeluaran, isLoading } = useQuery({
    queryKey: ['pengeluaran'],
    queryFn: pengeluaranService.getAll
  });

  const createMutation = useMutation({
    mutationFn: pengeluaranService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TPengeluaranCreate }) =>
      pengeluaranService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran'] });
      setEditData(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: pengeluaranService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran'] });
      setDeleteId(null);
    }
  });

  const totalPengeluaran =
    pengeluaran?.reduce((acc, curr) => acc + curr.jumlah, 0) || 0;

  const columns: ColumnDef<TPengeluaran>[] = [
    {
      accessorKey: 'keterangan',
      header: 'Keterangan Pengeluaran'
    },
    {
      accessorKey: 'jumlah',
      header: 'Jumlah pengeeluaran'
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
        <Heading title="Pengeluaran" description="Kelola data pengeluaran" />
        <PopupModal
          renderModal={(onClose) => (
            <div className="p-6">
              <Heading
                title="Tambah Pengeluaran"
                description="Tambah data pengeluaran baru"
              />
              <PengeluaranForm
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
            <CardTitle className="text-sm font-medium">
              Total Pengeluaran
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
                : `Rp ${totalPengeluaran.toLocaleString('id-ID')}`}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={pengeluaran || []} />

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
            <Heading title="Edit Maskapai" description="Edit data maskapai" />
            <PengeluaranForm
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
