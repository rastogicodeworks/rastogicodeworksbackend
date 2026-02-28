import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Rastogi Codeworks';
const DEFAULT_IMAGE = '/logo.png';
const DEFAULT_DESCRIPTION = 'Rastogi Codeworks - Where Code Meets Experience. Professional software development and digital solutions.';

/**
 * SEO component for per-page meta tags, Open Graph, Twitter Card, and optional keywords.
 * Use on each page with page-specific title, description, and optional path/image/keywords.
 * jsonLd can be a single object or an array of schema objects.
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_IMAGE,
  keywords = null,
  noIndex = false,
  type = 'website',
  jsonLd = null,
}) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rastogicodeworks.com';
  const canonical = path ? `${baseUrl}${path.startsWith('/') ? path : `/${path}`}` : baseUrl + '/';
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image.startsWith('/') ? image : `/${image}`}`;
  const fullTitle = title ? `${SITE_NAME} | ${title}` : `${SITE_NAME} | Where Code Meets Experience`;
  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && (
        <>
          <link rel="canonical" href={canonical} />
          <meta property="og:type" content={type} />
          <meta property="og:site_name" content={SITE_NAME} />
          <meta property="og:title" content={fullTitle} />
          <meta property="og:description" content={description} />
          <meta property="og:url" content={canonical} />
          <meta property="og:image" content={imageUrl} />
          <meta property="og:image:alt" content={SITE_NAME} />
          <meta property="og:locale" content="en_US" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={fullTitle} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={imageUrl} />
          <meta name="twitter:image:alt" content={SITE_NAME} />
        </>
      )}
      {jsonLdArray.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLdArray.length === 1 ? jsonLdArray[0] : { '@graph': jsonLdArray })}
        </script>
      )}
    </Helmet>
  );
}
