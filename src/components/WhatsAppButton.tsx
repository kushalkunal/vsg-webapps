import { buildWhatsAppLink } from "@/lib/contact";

export function WhatsAppButton() {
  const href = buildWhatsAppLink(
    "Hello Visionary Salva Group, I'd like to know more about admissions."
  );
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid place-items-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-elegant animate-pulse-glow hover:scale-110 transition-transform"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M19.11 17.21c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.11 4.51.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM16.02 5.33C10.13 5.33 5.34 10.12 5.34 16c0 1.97.54 3.82 1.49 5.41L5.34 26.67l5.43-1.42a10.6 10.6 0 005.25 1.4h.01c5.88 0 10.67-4.78 10.67-10.66 0-2.85-1.11-5.53-3.12-7.55a10.6 10.6 0 00-7.56-3.11z"/>
      </svg>
    </a>
  );
}
