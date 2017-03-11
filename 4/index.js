var fs = require('fs');
var urlModule = require('url');
var cheerio = require('cheerio');
var request = require('request-promise-native');

const DEBUG = true;
const LINKS_LIMIT = 1000;
const START_URL = 'http://ru.wikipedia.org/';
const OUTPUT_FILE = './links.txt';

class Parser {
  constructor(startUrl='http://ru.wikipedia.org/', urlsLimit=1000) {
    const { hostname } = urlModule.parse(startUrl, false, true);

    if (!hostname) {
      throw `Can't get hostname of ${startUrl}`;
    }
    this.baseHostname = hostname;

    this.urlsLimit = urlsLimit;
    this.urls = [startUrl];
    this.url = this.urlsQueue();
  }

  *urlsQueue() {
    for (let url of this.urls) {
      yield url;
    }
  }

  requestUrl(url) {
    DEBUG && console.log(`Start loading ${url}`);
    return request({
      url,
      transform: (content) => cheerio.load(content)
    }).catch(err => {
      console.error(err);
      throw new Error(`Loading failed ${url}`);
    });
  }

  parseLinks(url, $) {
    DEBUG && console.log('Start parsing');
    return Promise.resolve($)
      .then($ => Array.from($('a')))
      .then(links => links.map(el => $(el).attr('href'))) // Получаем ссылки из документа
      .then(links => links.filter(link => link)) // Фильтруем пустые ссылки
      .then(links => links.map(link => urlModule.resolve(url, link))) // Резолвим ссылку относительно страницы
      .then(links => links.filter(link => urlModule.parse(link).hostname === this.baseHostname)) // Оставляем внутренние ссылки
      .then(links => Array.from(new Set(links))) // Только уникальные ссылки
      .then(links => links.filter(link => this.urls.indexOf(link) === -1 )) // Оставляем только уникальные ссылки
      .catch(err => {
        console.error(err);
        throw new Error('Parsing failed');
      });
  }

  processUrl(url) {
    return this.requestUrl(url)
      .then(this.parseLinks.bind(this, url))
      .then(links => {
        Array.prototype.push.apply(this.urls, links);
        DEBUG && console.log(`Found ${links.length} links`);

        return false;
      })
      .catch(err => {
        console.error(err);
        throw new Error(`Error while processing URL ${url}`);
      });
  }

  next() {
    const { value, done } = this.url.next();
    if (done) {
      return Promise.resolve(true);
    }

    return this.processUrl(value);
  }

  getDelay() {
    return Math.floor(Math.random()*4000) + 1000;
  }

  run() {
    return this.next().then(done => {
      if (done || this.urls.length >= this.urlsLimit) {
        return Promise.resolve(this.urls);
      }

      return new Promise((resolve, reject) => {
        const delay = this.getDelay();
        DEBUG && console.log(`Wait ${delay}ms...`);
        setTimeout(() => resolve(this.run()), delay);
      });
    });
  }
}

const wiki = new Parser(START_URL, LINKS_LIMIT);
wiki.run().then(urls => {
  fs.writeFile(OUTPUT_FILE, urls.join('\r\n'), function(err) {
    if (err) {
      console.error(err);
    } else {
      DEBUG && console.log(`Saved to ${OUTPUT_FILE}\r\nTotal links in the file: ${urls.length}`);
      !DEBUG && console.log(urls.join('\r\n'));
    }
  });
});
