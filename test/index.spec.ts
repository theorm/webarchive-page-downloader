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
      timestamp: new Date('2017-02-03T06:47:24Z'),
      urlKey: 'org,archive,web)/test'
    }
    deepEqual(history[0], expectedFirstEntry)
  })
})

describe('getArchivedPage', () => {
  const testDate = new Date('1998-11-11T18:45:51Z')
  it('returns page content', async () => {
    const pageContent = await getArchivedPage('www.google.com', testDate)
    match(pageContent, /Google Search Engine Prototype/)
  })

  it('raises an error', async () => {
    try {
      await getArchivedPage('www.asdf123asdf.com', testDate)
      fail('Expected to throw an error')
    } catch (e) {
      equal(e.message, 'Incorrect statusCode: 404')
    }
  })
})
