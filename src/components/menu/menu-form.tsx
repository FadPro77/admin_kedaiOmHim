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
import { TMenu, TMenuCreate } from '@/types/menu';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FileUpload from '../shared/fileupload';

const formSchema = z.object({
  nama: z.string().min(1, 'Nama harus diisi'),
  harga: z.coerce.number().min(1, 'Harga harus diisi'),
  kategori: z.enum(['Makanan', 'Minuman']),
  ketersediaan: z.boolean(),
  image: z.union([
    z.instanceof(File),
    z.string() // kalau sudah ada URL lama
  ])
});

type TMenuFormProps = {
  initialData?: TMenu;
  onSubmit: (values: TMenuCreate) => void;
  loading?: boolean;
};

export function MenuForm({ initialData, onSubmit, loading }: TMenuFormProps) {
  console.log('Initial Data:', initialData);
  const form = useForm<TMenuCreate>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: initialData?.nama || '',
      harga: initialData?.harga || 0,
      kategori: initialData?.kategori || 'Makanan',
      ketersediaan: initialData?.ketersediaan || false,
      image: initialData?.image || ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Menu</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan Nama Menu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="harga"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga Menu</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan Harga Menu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kategori"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Menu</FormLabel>
              <FormControl>
                <select
                  {...field}
                  style={{
                    width: '100%',
                    height: '60%',
                    padding: '0.5rem',
                    border: '0.5px solid #fff',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: '#020817',
                    color: '#FFF',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    transition:
                      'border-color 0.3s ease, background-color 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#020817';
                    e.target.style.backgroundColor = '#333';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#020817';
                    e.target.style.backgroundColor = '#020817';
                  }}
                >
                  <option
                    value="Makanan"
                    style={{
                      backgroundColor: '#020817',
                      color: '#FFF'
                    }}
                  >
                    Makanan
                  </option>
                  <option
                    value="Minuman"
                    style={{
                      backgroundColor: '#020817',
                      color: '#FFF'
                    }}
                  >
                    Minuman
                  </option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ketersediaan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ketersediaan</FormLabel>
              <FormControl>
                <Input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gambar Menu</FormLabel>
              <FormControl>
                <FileUpload
                  onChange={(files) => field.onChange(files[0])}
                  value={field.value instanceof File ? [field.value] : []}
                />
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
