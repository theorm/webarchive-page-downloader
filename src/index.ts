import bent from 'bent'
import { fail } from 'assert'

const defaultGetJson = bent('json')
const defaultGetString = bent('string')

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
  getJson: bent.RequestFunction<bent.Json> = defaultGetJson
) {
  const response = await getJson(getArchiveHistoryUrl(url))
  return parseWebarchiveHistoryResponse(response as string[][])
}

export async function getArchivedPage(
  url: string,
  timestamp: Date,
  includeWaybackHeader = false,
  getString: bent.RequestFunction<string> = defaultGetString
) {
  return await getString(
    getArchivedPageUrl(url, timestamp, includeWaybackHeader)
  )
}
