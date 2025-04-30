// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch a browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
  console.log("Test: Page loaded!");

  // collect the first 100 articles's UNIX timestamps
  let unixTimestamps = [];
  let unixTimestampCount = 0;
  let nextPageUrl = 'https://news.ycombinator.com/newest';

  while (unixTimestampCount < 100 && nextPageUrl) {
    await page.goto(nextPageUrl);
    // get all UNIX timestamps from the current page
    const currentUnixTimestamps = await page.$$eval('.age', nodes =>
      nodes.map(node => {
        const title = node.getAttribute('title'); // for example, each timestamp looks like this: '2025-04-29T17:52:11 1745949131'
        return Number(title.split(' ').pop()); // only extract and return UNIX timestamp: 1745949131
      })
    );

    // if the count of collected unix timestamps and the count of current page unix timestamps is less than 100
    if (unixTimestampCount + currentUnixTimestamps.length < 100) {
      // then directly concatenate the current unix timestamps array to the collected unix timestamps array
      unixTimestamps = unixTimestamps.concat(currentUnixTimestamps);
      unixTimestampCount = unixTimestamps.length;
      console.log("If (unixTimestampCount + currentUnixTimestamps.length < 100), then upgrade unixTimestampCount into: " + unixTimestampCount);
    } else {
      // otherwise, add one by one until hit 100
      for (let ts of currentUnixTimestamps) {
        unixTimestampCount++;
        console.log("Otherwise, upgrade articlesCollection into: " + unixTimestampCount);
        if (unixTimestampCount <= 100) {
          unixTimestamps.push(ts);
        }
        if (unixTimestampCount == 100) {
          break;
        }
      }
    }
    // find the "More" link for pagination
    nextPageUrl = await page.$eval('a.morelink', link => link.href);
  }

  console.log(unixTimestamps);

  // Verify if sorted from newest to oldest
  let i = 0;
  let isSorted = true;
  while (i + 1 < 100) {
    console.log(unixTimestamps[i] + " >= " + unixTimestamps[i+1] + " is " + (unixTimestamps[i] >= unixTimestamps[i+1]));
    if (unixTimestamps[i] >= unixTimestamps[i+1]) {
      i++;
    } else {
      isSorted = false;
      break;
    }
  }

  if (isSorted) {
    console.log('The first 100 articles are sorted from newest to oldest.');
  } else {
    console.log('The first 100 articles are not sorted from newest to oldest.');
  }
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
