import React from 'react'
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
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <meta name="description" content={description} />
        <meta name="keywords" content="cadhub, app, application, web application, cad, code, code-cad, cad-modeling, community, website, cascade studio, openscad" />
        <title>Cadhub - {title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     </Helmet>
    </>
  )
}

export default Seo
