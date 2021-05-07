import { inflate, deflate } from 'pako'

/*
  some magic to get scripts to efficiently encoded into the URL.
  We're using pako to compress the script, but this outputs to a 8bit array. Stringifying this array adds a lot of overhead, because "125" has three characters in it
  Instead we're using the character codes to turn these a bit numbers into single characters
  base64 is used as well because not all of the characters are allowed in a url (and b64 is better than encodeURIComponent)
*/

export const encode = (string: string): string =>
  btoa(String.fromCharCode.apply(null, deflate(string)))

export const decode = (string: string): string =>
  inflate(
    new Uint8Array(
      atob(string)
        .split('')
        .map((character) => character.charCodeAt(0))
    ),
    { to: 'string' }
  )
