import { Helmet } from 'react-helmet'

const Seo = ({
  title,
  description,
  lang,
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
        <meta property="og:locale" content={lang} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="description" content={description} />
        <meta property="og:image" content={socialImageUrl} />
        <title>Cadhub - {title}</title>
      </Helmet>
    </>
  )
}

export default Seo
