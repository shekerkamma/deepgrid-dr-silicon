import {chromium} from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('https://deepgridsemi.com/',{waitUntil:'networkidle',timeout:60000});
await p.waitForTimeout(3000);
// hover any dropdown triggers to expose menus
for (const sel of ['header button','header [role="button"]','nav button']){
  for (const el of await p.$$(sel)){ try{ await el.hover(); await p.waitForTimeout(300);}catch{} }
}
const links=await p.evaluate(()=>[...new Set([...document.querySelectorAll('a[href]')]
  .map(a=>a.getAttribute('href')).filter(h=>h&&!h.startsWith('http')&&!h.startsWith('mailto')))]);
console.log('=== internal routes on the home page ===');
console.log(links.sort().join('\n'));
await b.close();
