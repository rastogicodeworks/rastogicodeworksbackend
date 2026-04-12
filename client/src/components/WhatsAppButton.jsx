/**
 * Floating Call + WhatsApp buttons (vertical stack, bottom-right).
 * Set VITE_WHATSAPP_NUMBER in .env (e.g. 919876543210 for India, no + or spaces).
 * Optional VITE_PHONE_NUMBER for tel: links; defaults to the WhatsApp number.
 * Optional VITE_WHATSAPP_MESSAGE for pre-filled chat text.
 */
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '918859985607').replace(/\D/g, '');
const PHONE_DIGITS = (import.meta.env.VITE_PHONE_NUMBER || WHATSAPP_NUMBER).replace(/\D/g, '');
const DEFAULT_MESSAGE =
  import.meta.env.VITE_WHATSAPP_MESSAGE ||
  'Hey, I am reaching out from your website. I would like to connect with Rastogi Codeworks. Could we schedule a call?';

function WhatsAppIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PhoneIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

const fabBase =
  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/90 sm:h-14 sm:w-14';

export default function WhatsAppButton() {
  if (!WHATSAPP_NUMBER) return null;

  const url = new URL('https://wa.me/' + WHATSAPP_NUMBER);
  url.searchParams.set('text', DEFAULT_MESSAGE);
  const telHref = PHONE_DIGITS ? `tel:+${PHONE_DIGITS}` : null;

  return (
    <div
      className="fixed z-[80] flex flex-col items-center gap-3 sm:gap-3.5
        right-3 sm:right-5 md:right-6 lg:right-8
        bottom-[calc(2.25rem+env(safe-area-inset-bottom,0px))]
        sm:bottom-[calc(2.75rem+env(safe-area-inset-bottom,0px))]
        md:bottom-[calc(3rem+env(safe-area-inset-bottom,0px))]
        lg:bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))]
        xl:bottom-[calc(4rem+env(safe-area-inset-bottom,0px))]"
      role="group"
      aria-label="Quick contact"
    >
      {telHref ? (
        <a
          href={telHref}
          aria-label="Call us"
          className={`${fabBase} bg-primary-600 shadow-primary-600/35 hover:bg-primary-500 hover:shadow-xl hover:shadow-primary-600/40 focus:ring-primary-500/80`}
        >
          <PhoneIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </a>
      ) : null}
      <a
        href={url.toString()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`${fabBase} bg-[#25D366] shadow-[#25D366]/30 hover:bg-[#20BD5A] hover:shadow-xl hover:shadow-[#25D366]/40 focus:ring-[#25D366]/80`}
      >
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      </a>
    </div>
  );
}
