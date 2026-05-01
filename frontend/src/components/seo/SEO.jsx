import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Zignature Semantics',
  description = 'Zignature Semantics - Engineering monolithic structural experiences for the digital frontier.',
  keywords = 'web development, digital agency, software engineering, recruitment, sales, marketing',
  ogImage = '/android-chrome-512x512.png',
  canonicalUrl,
  noindex = false,
}) => {
  const fullTitle = title.includes('Zignature') ? title : `${title} - Zignature Semantics`;
  const canonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://zignature.com');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Zignature Semantics" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
};

export default SEO;
