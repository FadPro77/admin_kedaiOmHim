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
  const sumPemasukan = dataTotal?.data?.pemasukanCount ?? 0;

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
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-clipboard-list-icon lucide-clipboard-list h-4 w-4 text-muted-foreground"
                  >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="M12 11h4" />
                    <path d="M12 16h4" />
                    <path d="M8 11h.01" />
                    <path d="M8 16h.01" />
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
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-book-text-icon lucide-book-text h-4 w-4 text-muted-foreground"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                    <path d="M8 11h8" />
                    <path d="M8 7h6" />
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
                    className="lucide lucide-arrow-down-up-icon lucide-arrow-down-up h-4 w-4 text-muted-foreground"
                  >
                    <path d="m3 16 4 4 4-4" />
                    <path d="M7 20V4" />
                    <path d="m21 8-4-4-4 4" />
                    <path d="M17 4v16" />
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
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-banknote-arrow-up-icon lucide-banknote-arrow-up h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
                    <path d="M18 12h.01" />
                    <path d="M19 22v-6" />
                    <path d="m22 19-3-3-3 3" />
                    <path d="M6 12h.01" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingDataTotal
                      ? 'Loading...'
                      : `Rp ${totalPengeluaran.toLocaleString('id-ID')}`}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Pemasukan
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
                    className="lucide lucide-banknote-arrow-down-icon lucide-banknote-arrow-down h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
                    <path d="m16 19 3 3 3-3" />
                    <path d="M18 12h.01" />
                    <path d="M19 16v6" />
                    <path d="M6 12h.01" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingDataTotal
                      ? 'Loading...'
                      : `Rp ${sumPemasukan.toLocaleString('id-ID')}`}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saldo</CardTitle>
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
                    className="lucide lucide-banknote-icon lucide-banknote h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="12" x="2" y="6" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingDataTotal
                      ? 'Loading...'
                      : `Rp ${totalSaldo.toLocaleString('id-ID')}`}
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
