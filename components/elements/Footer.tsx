"use client"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/50 px-4 py-6 text-center text-sm text-muted-foreground">
      &copy; {new Date().getFullYear()} My Eshop. All rights reserved.
    </footer>
  );
}