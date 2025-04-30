import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Menu',
    href: '/menu',
    icon: 'clipboardList',
    label: 'Menu'
  },
  {
    title: 'Pengeluaran',
    href: '/pengeluaran',
    icon: 'BadgeMinus',
    label: 'Pengeluaran'
  },
  {
    title: 'Saldo',
    href: '/saldo',
    icon: 'BadgeDollarSign',
    label: 'Saldo'
  },
  {
    title: 'Payment',
    href: '/payment',
    icon: 'ArrowLeftRight',
    label: 'Payment'
  }

  // {
  //   title: 'Login',
  //   href: '/login',
  //   icon: 'login',
  //   label: 'Login'
  // }
];
