const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'sitemap.xml');

if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
  console.log('Deleted public/sitemap.xml');
} else {
  console.log('public/sitemap.xml does not exist');
}
