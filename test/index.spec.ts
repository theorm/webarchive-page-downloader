import { deepEqual, match, fail, equal } from 'assert'
import { getPageArchiveHistory, getArchivedPage } from '../src'

describe('getPageArchiveHistory', () => {
  const testUrl = 'web.archive.org/test'
  it('returns expected response', async () => {
    const history = await getPageArchiveHistory(testUrl)
    const expectedFirstEntry = {
      digest: '3I42H3S6NNFQ2MSVX7XZKYAYSCX5QBYJ',
      length: 433,
      mimeType: 'text/html',
      originalUrl: 'https://web.archive.org/test',
      statusCode: 302,
      timestamp: 20170203064724,
      urlKey: 'org,archive,web)/test'
    }
    deepEqual(history[0], expectedFirstEntry)
  })
})

describe('getArchivedPage', () => {
  it('returns page content', async () => {
    const pageContent = await getArchivedPage('www.google.com', 19981111184551)
    match(pageContent, /Google Search Engine Prototype/)
  })

  it('raises an error', async () => {
    try {
      await getArchivedPage('www.asdf123asdf.com', 19981111184551)
      fail('Expected to throw an error')
    } catch (e) {
      equal(e.message, 'Incorrect statusCode: 404')
    }
  })
})