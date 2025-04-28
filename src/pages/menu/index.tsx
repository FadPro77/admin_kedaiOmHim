import { AlertModal } from '@/components/shared/alert-modal';
import DataTable from '../../components/shared/data-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import Heading from '@/components/shared/heading';
import PopupModal from '@/components/shared/popup-modal';
import { Button } from '@/components/ui/button';
import { menuService } from '../../services/menu';
import { TMenu, TMenuCreate } from '@/types/menu';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { MenuForm } from '../../components/menu/menu-form';
import EditModal from '@/components/shared/edit-modal';

export default function MenuPage() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editData, setEditData] = useState<TMenu | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: menu, isLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: menuService.getAll
  });

  const createMutation = useMutation({
    mutationFn: menuService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TMenuCreate }) =>
      menuService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      setEditData(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: menuService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      setDeleteId(null);
    }
  });

  const columns: ColumnDef<TMenu>[] = [
    {
      accessorKey: 'nama',
      header: 'Nama Menu'
    },
    {
      accessorKey: 'harga',
      header: 'Harga Menu'
    },
    {
      accessorKey: 'kategori',
      header: 'Kategori Menu'
    },
    {
      accessorKey: 'ketersediaan',
      header: 'Ketersediaan',
      cell: ({ row }) => (row.original.ketersediaan ? 'true' : 'false')
    },
    {
      accessorKey: 'image',
      header: 'Gambar',
      cell: ({ row }) => (
        <img
          src={row.original.image}
          alt={row.original.nama}
          className="h-10 w-10 object-contain"
        />
      )
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
        <Heading title="Menu" description="Kelola data menu" />
        <PopupModal
          renderModal={(onClose) => (
            <div className="p-6">
              <Heading
                title="Tambah Menu"
                description="Tambah data menu baru"
              />
              <MenuForm
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

      <DataTable columns={columns} data={menu || []} />

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
            <MenuForm
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
