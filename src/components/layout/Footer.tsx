import { Link } from "react-router-dom";

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/longevitychannel/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@LongevityChannel1",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.5V8.5l6.3 3.5-6.3 3.5Z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/longevitychannel1/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0a12 12 0 0 0-4.4 23.2c-.1-.9-.2-2.2 0-3.2l1.4-6s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4-.3 1.2.6 2.2 1.8 2.2 2.1 0 3.7-2.2 3.7-5.5 0-2.9-2.1-4.9-5-4.9-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.3l-.3 1.4c-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.6 0-3.8 2.7-7.2 7.9-7.2 4.1 0 7.4 3 7.4 6.9 0 4.1-2.6 7.5-6.2 7.5-1.2 0-2.4-.6-2.8-1.4l-.8 3c-.3 1.1-.9 2.2-1.4 3A12 12 0 1 0 12 0Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/longevity-channel-1",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1a3.8 3.8 0 0 1 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5v6.3ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 1 .8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7c0-1-.8-1.7-1.8-1.7Z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61585188924360",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3v-2.7c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12Z" />
      </svg>
    ),
  },
];

const Footer = () => (
  <footer className="bg-foreground py-16 lg:py-20">
    <div className="editorial-container">
      <div className="flex flex-col items-center text-center gap-10">
        {/* Brand */}
        <div>
          <Link to="/" className="font-serif text-2xl font-semibold text-background">
            Longevity Channel 1
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-background/50">
            An independent resource for understanding longevity technology —
            for individuals and operators alike.
          </p>
        </div>

        {/* Shop CTA */}
        <a
          href="https://shop.longevitychannel1.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center h-11 px-8 bg-background text-foreground text-xs font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-background/90 transition-colors"
        >
          Shop Now
        </a>

        {/* Social Icons */}
        <div className="flex items-center gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-background/50 hover:text-background transition-colors"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Address & Copyright */}
        <div className="space-y-2">
          <p className="text-sm text-background/40">
            433 Broadway, New York, NY 10013
          </p>
          <p className="text-xs text-background/30">
            © {new Date().getFullYear()} Longevity Channel 1. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
