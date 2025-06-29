import { usePathname } from "next/navigation";
import Button from "../Button";
import NavLink from "../NavLink";

export default function DesktopNav({ logout }: { logout: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/main" && <NavLink href="/main">Recipes</NavLink>}
      {pathname !== "/personal.chef" && (
        <NavLink href="/personal-chef">Personal chef</NavLink>
      )}
      {pathname !== "/create.recipes" && (
        <NavLink href="/create-recipes">Create recipe</NavLink>
      )}
      {pathname !== "/favourites" && (
        <NavLink href="/favourites">Favourites</NavLink>
      )}
      {pathname !== "/chat" && <NavLink href="/chat">Chat</NavLink>}
      {pathname !== "/dashboard" && (
        <NavLink href="/dashboard">My space</NavLink>
      )}
      <Button
        onClick={() => {
          logout();
        }}
        backgroundColor="bg-red-500"
      >
        Logout
      </Button>
    </>
  );
}
