import { extractMetaData } from 'src/helpers/markdown'
import Editor from 'rich-markdown-editor'
import { useRef } from 'react'
import KeyValue from 'src/components/KeyValue/KeyValue'

export default function EditorGuide({ content }) {
  const [rawMetadata, metadata] = extractMetaData(content)

  const processedContent = rawMetadata
    ? content.replace(rawMetadata[0], '')
    : content
  const ref = useRef(null)

  return (
    <div className="markdown-overrides py-6 px-8">
      {metadata && (
        <>
          <h1 className="my-4">{metadata.title}</h1>
          <section className="grid grid-cols-3 my-6 gap-y-4">
            {Object.entries(metadata)
              .filter(([key]) => key !== 'title')
              .map(([key, value], i) => (
                <KeyValue keyName={key.replace(/"/g, '')} key={key + '-' + i}>
                  <LinkOrParagraph>{value}</LinkOrParagraph>
                </KeyValue>
              ))}
          </section>
        </>
      )}
      <Editor
        ref={ref}
        readOnly={true}
        defaultValue={processedContent}
        value={processedContent}
        onChange={() => {}}
      />
    </div>
  )
}

function LinkOrParagraph({ children }) {
  const markdownUrlExpression =
    /\[(.*)\]\((https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})\)/i
  const matches = children.match(markdownUrlExpression)

  return matches === null ? (
    <p>{children}</p>
  ) : (
    <a href={matches[2]} rel="noopener noreferrer" target="_blank">
      {matches[1]}
    </a>
  )
}
