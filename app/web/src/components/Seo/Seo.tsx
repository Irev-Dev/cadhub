import { Helmet } from 'react-helmet'

const Seo = ({
  title = "CadHub",
  description = "Edit this part of CadHub",
  lang = 'en-US',
  socialImageUrl,
}: {
  title: string
  description: string
  lang: string
  socialImageUrl?: string
}) => {
  return (
    <>
      <Helmet
        htmlAttributes={{
          lang,
        }}
        title={title}
        titleTemplate={`Cadhub - ${title}`}
      >
        <title>{title || 'cadhub'}</title>
        <meta name="description" content={description} />

        {/*  Facebook Meta Tags */}
        <meta property="og:url" content={location.href} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={socialImageUrl} />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="cadhub.xyz" />
        <meta property="twitter:url" content={location.href} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={socialImageUrl} />

        <meta property="og:locale" content={lang} />
      </Helmet>
    </>
  )
}

export default Seo
