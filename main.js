const fs = require('fs');
const puppeteer = require('puppeteer');

async function screenshotWithElements(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(url);
  await page.setViewport({
    width: 1440,
    height: 1024,
    deviceScaleFactor: 1,
  });

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
      // Select all elements with the same position
      const overlappingElements = document.querySelectorAll(`[style*="position: ${element.style.position}; top: ${element.style.top}; left: ${element.style.left};"]`);

      // Create a diagonal offset for each overlapping label
      const diagonalOffset = 15;
      const index = Array.from(overlappingElements).indexOf(element);
      const diagonalPosition = `translate(${index * diagonalOffset}px, ${index * diagonalOffset}px)`;

      // Create the label and apply the diagonal position
      const label = document.createElement('div');
      label.textContent = element.tagName.toLowerCase();
      label.style.position = 'absolute';
      label.style.top = 0;
      label.style.left = 0; 
      label.style.backgroundColor = 'red';
      label.style.color = 'white';
      label.style.padding = '2px';
      label.style.fontSize = '8px';
      label.style.zIndex = '9999';
      label.style.transform = diagonalPosition; // Apply the diagonal offset

      // Add the label to the parent element
      const parent = element.parentElement;
      parent.style.position = 'relative';
      parent.appendChild(label);

      // Update the lastLabelTop and lastLabelHeight variables
      lastLabelTop = parseInt(label.style.top);
      lastLabelHeight = label.getBoundingClientRect().height;
      
      const boxModel = window.getComputedStyle(element, null);
      const padding = boxModel.padding.split(' ').join('px, ') + 'px';
      const margin = boxModel.margin.split(' ').join('px, ') + 'px';
      
      const paddingHighlight = document.createElement('div');
      paddingHighlight.style.position = 'absolute';
      paddingHighlight.style.top = '50%';
      paddingHighlight.style.left = '50%';
      paddingHighlight.style.transform = 'translate(-50%, -50%)';
      paddingHighlight.style.boxSizing = 'border-box';
      paddingHighlight.style.border = '1px dashed #9D96EB';
      paddingHighlight.style.opacity = '0.5';
      paddingHighlight.style.width = `calc(100% - ${padding})`;
      paddingHighlight.style.height = `calc(100% - ${padding})`;
      paddingHighlight.style.zIndex = '9999';
      element.appendChild(paddingHighlight);
    
      const marginHighlight = document.createElement('div');
      marginHighlight.style.position = 'absolute';
      marginHighlight.style.top = '50%';
      marginHighlight.style.left = '50%';
      marginHighlight.style.transform = 'translate(-50%, -50%)';
      marginHighlight.style.boxSizing = 'border-box';
      marginHighlight.style.border = '1px dashed #96DBEB';
      marginHighlight.style.opacity = '0.5';
      marginHighlight.style.width = `calc(100% + ${margin})`;
      marginHighlight.style.height = `calc(100% + ${margin})`;
      marginHighlight.style.zIndex = '9999';
      element.insertBefore(marginHighlight, element.firstChild);
      
      if (parent.tagName.toLowerCase() !== 'body') {
        parent.style.border = '2px solid #96EBD1';
      }
    });
  }

  await page.screenshot({ path: './screenshots/screenshot.png', fullPage: true});
  
  fs.writeFile('./json/elementData.json', JSON.stringify(elementData, null, 2), (err) => {
    if (err) throw err;
    console.log('File saved');
  });

  await browser.close();
}

screenshotWithElements('https://form.antdv.com/');
