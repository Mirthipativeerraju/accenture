import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-6 md:py-0">
      <div className="mx-auto w-full max-w-7xl flex flex-col items-center justify-between gap-4 px-4 md:h-24 md:flex-row md:px-8">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for educational purposes.{" "}
            <Link href="/about" className="font-medium underline underline-offset-4">
              Read Disclaimer
            </Link>.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/how-it-works" className="hover:underline">
            How It Works
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
