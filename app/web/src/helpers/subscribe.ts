export const subscribe = ({
  email,
  addMessage,
  name,
}: {
  email: string
  addMessage: Function
  name: string
}) => {
  // subscribe to mailchimp newsletter
  const path = window.location.hostname + window.location.pathname
  try {
    fetch(
      `https://kurthutten.us10.list-manage.com/subscribe/post-json?u=cbd8888e924bdd99d06c14fa5&amp;id=6a765a8b3d&EMAIL=${email}&FNAME=${name}&PATHNAME=${path}&c=__jp0`
    )
  } catch (e) {
    setTimeout(() => {
      addMessage('Problem subscribing to newsletter')
    }, 1000)
  }
}
