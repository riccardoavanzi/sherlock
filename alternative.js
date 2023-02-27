
// PUPPETEER
const fs = require('fs'); // NODE ACCESS TO FILE SYSTEM
const puppeteer = require('puppeteer'); // PPTR INIT

// BROWSER INITIALISATION
async function screenshotWithElements(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // URLS
  await page.goto('https://www.tencent.com/en-us/');
  await page.setViewport({
      width: 1440,
      height: 1024,
      deviceScaleFactor: 1,
  });

  // MAPPING ELEMENTS
  const elements = await page.$$('header, nav, menu, h1, h2, h3, h4, h5, h6, p, a, span, button, ul, li, form, input, img, picture, i, video, svg');
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
  
  fs.writeFile('./json/elementData.json', JSON.stringify(elementData, null, 2), (err) => {
    if (err) throw err;
    console.log('File saved');
  });

  await browser.close();
}

screenshotWithElements();


// const paddingHighlight = document.createElement('div');
//       paddingHighlight.style.position = 'absolute';
//       paddingHighlight.style.top = '0';
//       paddingHighlight.style.left = '0';
//       paddingHighlight.style.right = '0';
//       paddingHighlight.style.bottom = '0';
//       paddingHighlight.style.backgroundColor = 'rgba(191, 79, 255, 0.02)';
//       paddingHighlight.style.zIndex = '99999';
//       paddingHighlight.style.padding = padding;
//       element.appendChild(paddingHighlight);

//       const marginHighlight = document.createElement('div');
//       marginHighlight.style.position = 'absolute';
//       marginHighlight.style.top = '-10px';
//       marginHighlight.style.left = '-10px';
//       marginHighlight.style.right = '-10px';
//       marginHighlight.style.bottom = '-10px';
//       marginHighlight.style.backgroundColor = 'rgba(0, 191, 255, 0.02)';
//       marginHighlight.style.zIndex = '99999';
//       marginHighlight.style.margin = margin;
//       element.insertBefore(marginHighlight, element.firstChild);