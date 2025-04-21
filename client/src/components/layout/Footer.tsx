import { SiGithub } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} TeamGENZ. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium hover:underline"
          >
            Privacy
          </a>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium hover:underline"
          >
            Terms
          </a>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium hover:underline"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}