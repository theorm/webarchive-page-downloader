import fetch from 'node-fetch'
import { fail } from 'assert'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = { [key: string]: any; [key: number]: any } | any[]
type GetJsonFunction = (url: string) => Promise<Json>
type GetStringFunction = (url: string) => Promise<string>

const defaultGetJson = (url: string) => fetch(url).then(res => res.json())
const defaultGetString = (url: string) =>
  fetch(url).then(res => {
    if (res.ok) return res.text()
    throw new Error(`${res.statusText} (${res.status})`)
  })

const getArchiveHistoryUrl = (url: string) =>
  `http://web.archive.org/cdx/search/cdx?url=${url}&output=json`

const toWebArchiveTimestamp = (timestamp: Date) => {
  return [
    timestamp.getUTCFullYear(),
    timestamp.getUTCMonth() + 1,
    timestamp.getUTCDate(),
    timestamp.getUTCHours(),
    timestamp.getUTCMinutes(),
    timestamp.getUTCSeconds()
  ].join('')
}

const getArchivedPageUrl = (
  url: string,
  timestamp: Date,
  includeWaybackHeader = false
) =>
  `https://web.archive.org/web/${toWebArchiveTimestamp(timestamp)}${
    includeWaybackHeader ? '' : 'id_'
  }/${url}/`

export interface UrlArchiveHistory {
  urlKey: string
  timestamp: Date
  originalUrl: string
  mimeType: string
  statusCode: number
  digest: string
  length: number
}

const TimestampRegex = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/

const parseTimestamp = (timestamp: string) => {
  const parts = timestamp.match(TimestampRegex)?.slice(1)
  if (parts == null) fail(`Could not parse timestamp from string: ${timestamp}`)

  const [year, month, day, hour, minute, second] = parts
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`)
}

function parseWebarchiveHistoryResponse(response: string[][]) {
  return response.slice(1).map(
    entry =>
      ({
        urlKey: entry[0],
        timestamp: parseTimestamp(entry[1]),
        originalUrl: entry[2],
        mimeType: entry[3],
        statusCode: parseInt(entry[4], 10),
        digest: entry[5],
        length: parseInt(entry[6], 10)
      } as UrlArchiveHistory)
  )
}

export async function getPageArchiveHistory(
  url: string,
  getJson: GetJsonFunction = defaultGetJson
) {
  const response = await getJson(getArchiveHistoryUrl(url))
  return parseWebarchiveHistoryResponse(response as string[][])
}

export async function getArchivedPage(
  url: string,
  timestamp: Date,
  includeWaybackHeader = false,
  getString: GetStringFunction = defaultGetString
) {
  return await getString(
    getArchivedPageUrl(url, timestamp, includeWaybackHeader)
  )
}
