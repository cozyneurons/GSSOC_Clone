import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="container mx-auto flex flex-col gap-4 py-10 px-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              GSSOC Clone
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Empowering students to contribute to open source.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm">Platform</h3>
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary">Projects</Link>
            <Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-primary">Leaderboard</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm">Legal</h3>
            <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary">Privacy Policy</span>
            <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary">Terms of Service</span>
          </div>
        </div>
      </div>
      <div className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GSSOC Clone. All rights reserved.
      </div>
    </footer>
  );
}
