import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { useSidebar } from "@/hooks/use-sidebar";

export function Header() {
  const { isOpen, toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={toggle}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        <div className="mr-4 hidden md:flex">
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search component here if needed */}
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  );
} 