import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
import { TPayment, TPaymentCreate } from '@/types/payment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TPesanan } from '@/types/pesanan';
import * as z from 'zod';

const formSchema = z.object({
  metode: z.enum(['tunai', 'midtrans']),
  pesanan_id: z.coerce.number().min(1, 'pesanan id harus diisi'),
  status: z.enum(['pending', 'success'])
});

type TPaymentFormProps = {
  initialData?: TPayment;
  onSubmit: (values: TPaymentCreate) => void;
  loading?: boolean;
  pesanan: TPesanan[];
};

export function PaymentForm({
  initialData,
  onSubmit,
  loading,
  pesanan
}: TPaymentFormProps) {
  console.log('Initial Data:', initialData);
  const form = useForm<TPaymentCreate>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      metode: initialData?.metode || 'tunai',
      pesanan_id: initialData?.pesanan_id ?? 0,
      status: initialData?.status || 'pending'
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="metode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metode Payment</FormLabel>
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
                    value="tunai"
                    style={{
                      backgroundColor: '#020817',
                      color: '#FFF'
                    }}
                  >
                    Tunai
                  </option>
                  <option
                    value="midtrans"
                    style={{
                      backgroundColor: '#020817',
                      color: '#FFF'
                    }}
                  >
                    Midtrans
                  </option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pesanan_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pesanan</FormLabel>
              <FormControl>
                <select
                  {...field}
                  value={field.value?.toString()}
                  onChange={(e) => {
                    const value =
                      e.target.value === '' ? 0 : Number(e.target.value);
                    field.onChange(value);
                  }}
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
                  <option value="">Global Notification</option>
                  {pesanan.map((pesanan) => (
                    <option key={pesanan.id} value={pesanan.id}>
                      {pesanan.id}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Payment</FormLabel>
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
                    value="success"
                    style={{
                      backgroundColor: '#020817',
                      color: '#FFF'
                    }}
                  >
                    Success
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
