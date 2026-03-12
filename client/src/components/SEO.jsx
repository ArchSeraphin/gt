import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://gtpaysage38.fr';

export default function SEO({
  title,
  description,
  canonical,
  image = '/img/og-default.jpg',
  noindex = false,
}) {
  const fullTitle = title ? `${title} | G&T Paysage` : 'G&T Paysage';
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const absoluteCanonical = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${SITE_URL}${canonical}`
    : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {absoluteCanonical && <link rel="canonical" href={absoluteCanonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={absoluteImage} />
      {absoluteCanonical && <meta property="og:url" content={absoluteCanonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
    </Helmet>
  );
}
