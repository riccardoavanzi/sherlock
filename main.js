
// FIREBASE INIT
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyDkcXLdP-nXiSf2b0tjzQJnhhgfpKuL_GE",
  authDomain: "sherlock-79215.firebaseapp.com",
  projectId: "sherlock-79215",
  storageBucket: "sherlock-79215.appspot.com",
  messagingSenderId: "252442690424",
  appId: "1:252442690424:web:98e1822b6c56ad4f363e8d",
  measurementId: "G-KVE66S9HX8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


/////////////////////////////////////
/////////////////////////////////////

// PUPPETEER
const fs = require('fs'); // NODE ACCESS TO FILE SYSTEM
const puppeteer = require('puppeteer'); // PPTR INIT

// BROWSER INITIALISATION
async function screenshotWithElements(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // URLS
  await page.goto('https://www.docker.com');
  await page.setViewport({
      width: 1440,
      height: 1024,
      deviceScaleFactor: 1,
  });

  // MAPPING ELEMENTS
  const elements = await page.$$('header, nav, menu, h1, h2, h3, h4, h5, h6, strong, p, a, span, button, ul, li, form, input, img, picture, i, video, svg');
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

//   const newPage = await browser.newPage();
//   await newPage.goto(`./screenshots/screenshot.png`);

}

screenshotWithElements();