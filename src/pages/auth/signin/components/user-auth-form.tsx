import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '@/redux/slices/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from '@/routes/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { authService } from '@/services/auth';
import { toast } from 'react-toastify';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string()
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultValues = {
    email: '',
    password: ''
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(data.email, data.password);
      localStorage.setItem('token', response.token);

      // NEW: Catch userData error separately
      try {
        const userData = await authService.getCurrentUser();

        if (userData.role_id === 1) {
          dispatch(setToken(response.token));
          dispatch(setUser(userData));

          toast.success('Login Successful');
          router.push('/');
        } else {
          toast.error(
            'You do not have the required permissions to access this page.'
          );
        }
      } catch (userError) {
        toast.error('Login succeeded but failed to fetch user data.');
        console.error('User fetching error:', userError);
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login Failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            disabled={loading}
            className="ml-auto w-full"
            type="submit"
            style={{ marginTop: '30px' }}
          >
            {loading ? 'Loading...' : 'Continue With Email'}
          </Button>
        </form>
      </Form>
    </>
  );
}
