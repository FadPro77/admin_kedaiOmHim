import PageHead from '@/components/shared/page-head.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs.js';
import { dashboardService } from '../../services/dashboard.ts';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Tpesanan } from '@/types/dashboard.ts';
import { TDataResponse, TApiResponse } from '@/types/dashboard.ts';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import DataTable from '../../components/shared/data-table';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { data: pesanan, isLoading } = useQuery({
    queryKey: ['pesanan'],
    queryFn: dashboardService.getAll
  });

  const { data: dataTotal, isLoading: isLoadingDataTotal } = useQuery<
    TApiResponse<TDataResponse>
  >({
    queryKey: ['dataTotal'],
    queryFn: dashboardService.getTotal
  });

  const totalMenu = dataTotal?.data?.menu ?? 0;
  const totalPayment = dataTotal?.data?.payment ?? 0;
  const totalPengeluaran = dataTotal?.data?.pengeluaran ?? 0;
  const totalPesanan = dataTotal?.data?.pesanan ?? 0;
  const totalUsers = dataTotal?.data?.users ?? 0;
  const totalSaldo = dataTotal?.data?.saldo ?? 0;

  const columns: ColumnDef<Tpesanan>[] = [
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: ({ row }) => {
        const rawValue = row.getValue('created_at');

        if (!rawValue || typeof rawValue !== 'string') {
          return '-'; // Kalau bukan string valid, kasih strip
        }

        const date = new Date(rawValue);
        if (isNaN(date.getTime())) {
          return '-'; // Kalau bukan tanggal valid
        }

        return format(date, 'yyyy-MM-dd HH:mm:ss');
      }
    },
    {
      accessorKey: 'status',
      header: 'Status'
    },
    {
      accessorKey: 'users.first_name',
      header: 'First Name'
    },
    {
      accessorKey: 'users.last_name',
      header: 'Last Name'
    },
    {
      accessorKey: 'users.phone',
      header: 'Phone'
    },
    {
      accessorKey: 'users.email',
      header: 'Email'
    }
  ];

  if (isLoading) return <DataTableSkeleton columnCount={5} />;
  return (
    <>
      <PageHead title="Dashboard | App" />
      <div className="max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Selamat Datang👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Menu
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
                    {isLoadingDataTotal ? 'Loading...' : totalMenu}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Pesanan
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
                    {isLoadingDataTotal ? 'Loading...' : totalPesanan}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-users h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingDataTotal ? 'Loading...' : totalUsers}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Payment
                  </CardTitle>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-tower-control h-4 w-4 text-muted-foreground"
                  >
                    <path d="M18.2 12.27 20 6H4l1.8 6.27a1 1 0 0 0 .95.73h10.5a1 1 0 0 0 .96-.73Z" />
                    <path d="M8 13v9" />
                    <path d="M16 22v-9" />
                    <path d="m9 6 1 7" />
                    <path d="m15 6-1 7" />
                    <path d="M12 6V2" />
                    <path d="M13 2h-2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingDataTotal ? 'Loading...' : totalPayment}
                  </div>
                </CardContent>
              </Card>
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
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-plane h-4 w-4 text-muted-foreground"
                  >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingDataTotal ? 'Loading...' : totalPengeluaran}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-plane h-4 w-4 text-muted-foreground"
                  >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingDataTotal ? 'Loading...' : totalSaldo}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-12 md:col-span-12">
                <CardHeader>
                  <CardTitle>Pesanan Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable columns={columns} data={pesanan || []} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
