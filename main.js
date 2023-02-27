
const fs = require('fs'); // NODE ACCESS TO FILE SYSTEM
const puppeteer = require('puppeteer'); // PPTR INIT

async function screenshotWithElements(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://www.github.com');
  await page.setViewport({
      width: 1440,
      height: 1024,
      deviceScaleFactor: 1,
  });

  const elements = await page.$$('button, h1, h2, h3, h4, h5, h6, header, footer, input, form, article, nav, i, svg, video, a, p, img');
  const elementData = {};

  for (let i = 0; i < elements.length; i++) {

    const element = elements[i];
    const tagName = await element.getProperty('tagName').then(tag => tag.jsonValue()).then(tag => tag.toLowerCase());
    const innerHTML = await element.getProperty('innerHTML').then(html => html.jsonValue());

    elementData[tagName] = elementData[tagName] || [];
    elementData[tagName].push({ innerHTML });

    await elements[i].evaluate((element) => {
      element.style.border = '2px solid red';
      const label = document.createElement('div');
      label.textContent = element.tagName.toLowerCase();
      label.style.position = 'absolute';
      label.style.top = 0;
      label.style.left = 0; 
      label.style.backgroundColor = 'red';
      label.style.color = 'white';
      label.style.padding = '2px';
      label.style.fontSize = '12px';
      element.appendChild(label);
    });
  }

  await page.screenshot({ path: './screenshots/screenshot.png', fullPage: true});
  
  fs.writeFile('elementData.json', JSON.stringify(elementData), (err) => {
    if (err) throw err;
    console.log('File saved');
  });

  await browser.close();

//   const newPage = await browser.newPage();
//   await newPage.goto(`./screenshots/screenshot.png`);

}

screenshotWithElements();