import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { SignedIn, UserButton } from "@clerk/nextjs";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <nav className="flex justify-between items-center border-b border-border h-[80px] px-4 py-2">
        <Logo />
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
            <SignedIn>
              <UserButton />
            </SignedIn>
        </div>
      </nav>
        <main className="flex w-full flex-grow justify-center p-4">{children}</main>
    </div>
  );
}

export default Layout;
