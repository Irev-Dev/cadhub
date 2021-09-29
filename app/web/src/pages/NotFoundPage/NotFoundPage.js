import MainLayout from 'src/layouts/MainLayout'
import Seo from 'src/components/Seo/Seo'

export default () => (
  <MainLayout>
    <Seo title="Page not found" description="404 page not found" lang="en-US" />

    <style
      dangerouslySetInnerHTML={{
        __html: `
              html, body {
                margin: 0;
              }
              html * {
                box-sizing: border-box;
              }
              main {
                display: flex;
                align-items: center;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                text-align: center;
                background-color: #E2E8F0;
                height: 100vh;
              }
              section {
                background-color: white;
                border-radius: 0.25rem;
                width: 32rem;
                padding: 1rem;
                margin: 0 auto;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
              }
              h1 {
                font-size: 2rem;
                margin: 0;
                font-weight: 500;
                line-height: 1;
                color: #2D3748;
              }
            `,
      }}
    />
    <section className="">
      <h1>
        <span className="font-ropa-sans">404 Page Not Found</span>
        <div className="text-sm">
          {location.href}{' '}
          <span role="img" aria-label="shrug">
            🤷
          </span>
        </div>
      </h1>
    </section>
  </MainLayout>
)
