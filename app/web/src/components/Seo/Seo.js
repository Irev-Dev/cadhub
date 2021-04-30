import { Helmet } from 'react-helmet'

const Seo = ({ title, description, lang }) => {
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
        <title>Cadhub - {title}</title>
      </Helmet>
    </>
  )
}

export default Seo
