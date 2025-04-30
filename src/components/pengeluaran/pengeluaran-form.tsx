import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TPengeluaran, TPengeluaranCreate } from '@/types/pengeluaran';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  keterangan: z.string().min(1, 'Keterangan harus diisi'),
  jumlah: z.coerce.number().min(1, 'Jumlah harus diisi')
});

type TPengeluaranFormProps = {
  initialData?: TPengeluaran;
  onSubmit: (values: TPengeluaranCreate) => void;
  loading?: boolean;
};

export function PengeluaranForm({
  initialData,
  onSubmit,
  loading
}: TPengeluaranFormProps) {
  console.log('Initial Data:', initialData);
  const form = useForm<TPengeluaranCreate>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keterangan: initialData?.keterangan || '',
      jumlah: initialData?.jumlah || 0
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="keterangan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan Pengeluaran</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan Keterangan Pengeluaran"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jumlah"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Pengeluaran</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan Jumlah Pengeluaran" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Simpan'}
        </Button>
      </form>
    </Form>
  );
}
