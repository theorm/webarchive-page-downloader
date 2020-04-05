# web.archive.org page downloader

Get archive history of a page and download pages from [web.archive.org](https://web.archive.org)

## Get history

```javascript
import {
  getPageArchiveHistory,
  getArchivedPage
} from 'webarchive-page-downloader'

// ...

const history = await getPageArchiveHistory('www.google.com')

/*
{
  urlKey: 'com,google)/',
  timestamp: 19981111184551,
  originalUrl: 'http://google.com:80/',
  mimeType: 'text/html',
  statusCode: 200,
  digest: 'HOQ2TGPYAEQJPNUA6M4SMZ3NGQRBXDZ3',
  length: 381
}
...
*/
```

## Download page at timestamp

```javascript
const pageContent = await getArchivedPage('www.google.com', 19981111184551)
```
