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
import { TSaldo, TSaldoCreate } from '@/types/saldo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  keterangan: z.string().min(1, 'Keterangan harus diisi'),
  jumlah: z.coerce.number().min(1, 'Jumlah harus diisi'),
  tipe: z.enum(['pemasukan', 'pengeluaran'])
});

type TSaldoFormProps = {
  initialData?: TSaldo;
  onSubmit: (values: TSaldoCreate) => void;
  loading?: boolean;
};

export function SaldoForm({ initialData, onSubmit, loading }: TSaldoFormProps) {
  console.log('Initial Data:', initialData);
  const form = useForm<TSaldoCreate>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keterangan: initialData?.keterangan || '',
      jumlah: initialData?.jumlah || 0,
      tipe: initialData?.tipe || 'pengeluaran'
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
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan Keterangan" {...field} />
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
              <FormLabel>Jumlah</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan Jumlah" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe</FormLabel>
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
                    value="pemasukan"
                    style={{
                      backgroundColor: '#020817',
                      color: '#FFF'
                    }}
                  >
                    pemasukan
                  </option>
                  <option
                    value="pengeluaran"
                    style={{
                      backgroundColor: '#020817',
                      color: '#FFF'
                    }}
                  >
                    pengeluaran
                  </option>
                </select>
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
