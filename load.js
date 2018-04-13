#!/usr/bin/env node

const parse = require('csv-parser');
const fs = require('fs');
const extractor = require('keyword-extractor');

const keywords = [];
const mostUsed = {};

async function readTitles() {
  await fs.createReadStream('youtube-data/USvideos.csv')
    .pipe(parse())
    .on('data', (data) => {
      const tags = extractor.extract(data.title, {
        language: 'english',
        remove_digits: true,
        return_changed_case: true,
      });

      tags.forEach((tag) => {
        keywords.push(tag.replace(/\||\[|\]/ig, ''));
      });
    })
    .on('end', () => {
      console.log(keywords.length);
      keywords.forEach((keyword) => {
        console.log(keyword);
        if (mostUsed.hasOwnProperty(keyword)) {
          mostUsed[keyword].value++;
        } else {
          mostUsed[keyword] = { value: 1 };
        }
      });

      const newArr = Object.entries(mostUsed);
      const result = newArr.sort((a, b) => b[1].value - a[1].value);
      console.log(result);
    });
}

readTitles();
