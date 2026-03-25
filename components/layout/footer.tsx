export default function Footer() {
  return (
    <footer className="h-12 border-t bg-white flex items-center justify-center text-sm text-muted-foreground w-full">
      © {new Date().getFullYear()} Cipherion. All Rights Reserved.
    </footer>
  );
}
