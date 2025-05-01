import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { logout } from '@/redux/slices/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  first_name: string;
  email: string;
  [key: string]: any;
};

export default function UserNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ambil dan decode token
  const token = localStorage.getItem('token');
  let user: DecodedToken | null = null;

  if (token) {
    try {
      user = jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Invalid token');
    }
  }

  const firstInitial = user?.first_name?.charAt(0).toUpperCase() || 'U';

  // Daftar warna Tailwind yang bisa digunakan
  const colors = [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-emerald-500',
    'bg-orange-500',
    'bg-teal-500'
  ];

  // Pilih warna berdasarkan kode ASCII huruf awal
  const colorIndex = firstInitial.charCodeAt(0) % colors.length;
  const backgroundColor = colors[colorIndex];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-14 w-14 rounded-full">
          <Avatar className="me-1 h-10 w-10">
            <AvatarImage src="" alt="" />
            <AvatarFallback className={`text-white ${backgroundColor}`}>
              {firstInitial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.first_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || ''}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
