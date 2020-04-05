import bent from 'bent'

const defaultGetJson = bent('json')
const defaultGetString = bent('string')

const getArchiveHistoryUrl = (url: string) =>
  `http://web.archive.org/cdx/search/cdx?url=${url}&output=json`

const getArchivedPageUrl = (
  url: string,
  timestamp: number,
  includeWaybackHeader = false
) =>
  `https://web.archive.org/web/${timestamp}${
    includeWaybackHeader ? '' : 'id_'
  }/${url}/`

export interface UrlArchiveHistory {
  urlKey: string
  timestamp: number
  originalUrl: string
  mimeType: string
  statusCode: number
  digest: string
  length: number
}

function parseWebarchiveHistoryResponse(response: string[][]) {
  return response.slice(1).map(
    entry =>
      ({
        urlKey: entry[0],
        timestamp: parseInt(entry[1], 10),
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
  timestamp: number,
  includeWaybackHeader = false,
  getString: bent.RequestFunction<string> = defaultGetString
) {
  return await getString(
    getArchivedPageUrl(url, timestamp, includeWaybackHeader)
  )
}
