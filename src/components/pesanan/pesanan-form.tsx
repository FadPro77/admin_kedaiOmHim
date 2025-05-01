import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { TPesanan, TPesananCreate } from '@/types/pesanan';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  status: z.enum(['pending', 'diantar', 'selesai'])
});

type TPesananFormProps = {
  initialData?: TPesanan;
  onSubmit: (values: TPesananCreate) => void;
  loading?: boolean;
};

export function PesananForm({
  initialData,
  onSubmit,
  loading
}: TPesananFormProps) {
  console.log('Initial Data:', initialData);
  const form = useForm<TPesananCreate>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: initialData?.status || 'pending'
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Pesanan</FormLabel>
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
                    value="pending"
                    style={{
                      backgroundColor: '#020817',
                      color: '#FFF'
                    }}
                  >
                    Pending
                  </option>
                  <option
                    value="diantar"
                    style={{
                      backgroundColor: '#020817',
                      color: '#FFF'
                    }}
                  >
                    Diantar
                  </option>
                  <option
                    value="selesai"
                    style={{
                      backgroundColor: '#020817',
                      color: '#FFF'
                    }}
                  >
                    Selesai
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
