import Button from "../Button";
import NavLink from "../NavLink";
import { usePathname } from "next/navigation";

export default function DesktopNav({ logout }: { logout: () => void }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-4">
        <nav className="flex-1 flex justify-center gap-4">
          <NavLink href="/main" isActive={pathname === "/main"}>
            Recipes
          </NavLink>
          <NavLink
            href="/personal-chef"
            isActive={pathname === "/personal-chef"}
          >
            Personal chef
          </NavLink>
          <NavLink href="/planner" isActive={pathname === "/planner"}>
            Planner
          </NavLink>
          <NavLink href="/chat" isActive={pathname === "/chat"}>
            Chat
          </NavLink>
          <NavLink href="/dashboard">My space</NavLink>
        </nav>
        <Button
          onClick={logout}
          backgroundColor="bg-[#6366F1] text-white"
          hoverColor="hover:bg-[#6366F1]/90"
          className="ml-8 px-6 py-2 text-base font-bold rounded-full shadow"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
