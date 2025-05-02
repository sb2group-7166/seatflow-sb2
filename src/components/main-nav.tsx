import { cn } from '@/lib/utils';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Users, Key, User } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link
        href="/"
        className="mr-6 flex items-center space-x-2"
      >
        <span className="hidden font-bold sm:inline-block">
          SeatFlow
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/dashboard"
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/students"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/students"
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Students
        </Link>
        <Link
          href="/reports"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/reports"
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Reports
        </Link>
        <div className="relative group">
          <button className="flex items-center space-x-1 transition-colors hover:text-foreground/80 text-foreground">
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </button>
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
            <Link
              href="/admin/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </div>
            </Link>
            <Link
              href="/admin/security"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <Key className="mr-2 h-4 w-4" />
                Security
              </div>
            </Link>
            <Link
              href="/admin/access-control"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Access Control
              </div>
            </Link>
            <Link
              href="/admin/team"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Team
              </div>
            </Link>
          </div>
        </div>
        <Link
          href="/settings"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/settings"
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Settings
        </Link>
      </nav>
    </div>
  );
} 