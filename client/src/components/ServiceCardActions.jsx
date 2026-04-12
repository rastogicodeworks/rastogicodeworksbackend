import { Link } from 'react-router-dom';
import { ArrowRight, IndianRupee } from 'lucide-react';

/**
 * Shared CTA row: service detail page + pricing anchor.
 * @param {string} [className] - Wrapper classes; default `mt-auto` for flex footers (e.g. Services page).
 */
export default function ServiceCardActions({ serviceId, variant = 'compact', className }) {
  const isLarge = variant === 'large';
  const marginClass = className ?? 'mt-auto';
  return (
    <div
      className={`${marginClass} flex flex-col sm:flex-row gap-2 sm:gap-3 w-full ${isLarge ? 'pt-1' : ''}`}
    >
      <Link
        to={`/services/${serviceId}`}
        className={`inline-flex items-center justify-center gap-2 flex-1 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow-md ${
          isLarge ? 'py-3 text-base' : 'py-2.5 text-sm'
        }`}
      >
        Service details
        <ArrowRight className="w-4 h-4 shrink-0" />
      </Link>
      <Link
        to={`/pricing#pricing-${serviceId}`}
        className={`inline-flex items-center justify-center gap-2 flex-1 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 font-semibold hover:border-primary-200 hover:bg-primary-50 hover:text-primary-800 transition-all duration-300 ${
          isLarge ? 'py-3 text-base' : 'py-2.5 text-sm'
        }`}
      >
        <IndianRupee className="w-4 h-4 shrink-0" aria-hidden />
        Pricing
      </Link>
    </div>
  );
}
