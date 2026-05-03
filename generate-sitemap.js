// Script tạo sitemap entries cho 366 ngày
// Chạy file này bằng Node.js: node generate-sitemap.js
// Sau đó copy output vào public/sitemap.xml

const BASE_URL = 'https://www.gocvutru.com';
const TODAY = '2026-05-03';

const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let urls = [];

for (let month = 1; month <= 12; month++) {
  for (let day = 1; day <= daysInMonth[month]; day++) {
    urls.push(`  <url>
    <loc>${BASE_URL}/cung-hoang-dao/sinh-ngay-${day}-thang-${month}-la-cung-gi</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }
}

console.log('<?xml version="1.0" encoding="UTF-8"?>');
console.log('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
urls.forEach(u => console.log(u));
console.log('</urlset>');
