import { Helmet } from 'react-helmet'
import { useIsBrowser } from '@redwoodjs/prerender/browserUtils'

const Seo = ({
  title = 'CadHub',
  description = 'Edit this part of CadHub',
  lang = 'en-US',
  socialImageUrl,
}: {
  title: string
  description: string
  lang: string
  socialImageUrl?: string
}) => {
  const browser = useIsBrowser()
  return (
    <>
      <Helmet
        htmlAttributes={{
          lang,
        }}
        title={title}
        titleTemplate={`Cadhub - ${title}`}
      >
        {title && <title>{title || 'cadhub'}</title>}
        {description && <meta name="description" content={description} />}

        {/*  Facebook Meta Tags */}
        {browser && <meta property="og:url" content={location.href} />}
        <meta property="og:type" content="website" />
        {title && <meta property="og:title" content={title} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        {socialImageUrl && (
          <meta property="og:image" content={socialImageUrl} />
        )}

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="cadhub.xyz" />
        {browser && <meta property="twitter:url" content={location.href} />}
        {title && <meta name="twitter:title" content={title} />}
        {description && (
          <meta name="twitter:description" content={description} />
        )}
        {socialImageUrl && (
          <meta name="twitter:image" content={socialImageUrl} />
        )}

        {lang && <meta property="og:locale" content={lang} />}
      </Helmet>
    </>
  )
}

export default Seo
