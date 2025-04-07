import { usePathname } from "next/navigation";
import Button from "../Button";
import NavLink from "../NavLink";

export default function DesktopNav({ logout }: { logout: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/main" && <NavLink href="/main">Recipes</NavLink>}
      {pathname !== "/create.recipes" && (
        <NavLink href="/create-recipes">Create recipe</NavLink>
      )}
      {pathname !== "/profile" && <NavLink href="/profile">Profile</NavLink>}
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
