import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Catch page errors
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  try {
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });
    
    console.log('Clicking the Youth environment selector...');
    await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const youthCard = elements.find(el => el.textContent && el.textContent.includes('منصة الشاب') && el.closest('div.cursor-pointer'));
        if (youthCard) youthCard.closest('div.cursor-pointer').click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Clicking Skip Onboarding...');
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const skipBtn = btns.find(b => b.textContent && b.textContent.includes('تخطي الجولة'));
        if (skipBtn) skipBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('Questionnaire Step 1: Health');
    await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div.cursor-pointer'));
        const health = cards.find(c => c.textContent && c.textContent.includes('الصحة العامة'));
        if (health) health.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    console.log('Questionnaire Step 2: Medium');
    await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div.cursor-pointer'));
        const med = cards.find(c => c.textContent && c.textContent.includes('متوسط'));
        if (med) med.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    console.log('Questionnaire Step 3: 15 min');
    await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div.cursor-pointer'));
        const time = cards.find(c => c.textContent && c.textContent.includes('15 دقيقة'));
        if (time) time.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    console.log('Questionnaire Step 4: AR');
    await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div.cursor-pointer'));
        const ar = cards.find(c => c.textContent && c.textContent.includes('الواقع المعزز (AR)'));
        if (ar) ar.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    console.log('Questionnaire Step 5: Competitions');
    await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div.cursor-pointer'));
        const comp = cards.find(c => c.textContent && c.textContent.includes('المنافسة والتحدي'));
        if (comp) comp.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    console.log('Questionnaire Step 6: Player');
    await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div.cursor-pointer'));
        const player = cards.find(c => c.textContent && c.textContent.includes('أود التجربة فقط'));
        if (player) player.click();
    });

    console.log('Waiting for AI Analysis to finish (5 seconds)...');
    await new Promise(r => setTimeout(r, 5000));
    
    console.log('Waiting 2 seconds to check for crashes...');
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Done.');
  } catch (err) {
    console.log('PUPPETEER EXCEPTION:', err);
  } finally {
    await browser.close();
  }
})();
