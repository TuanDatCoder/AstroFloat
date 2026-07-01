const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\laptop\\Downloads\\Cards-png';
const destDir = 'd:\\GitHub\\AstroFloat\\public\\assets\\cards';

// Đảm bảo thư mục đích tồn tại
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 1. Bản đồ lá Ẩn Chính (Major Arcana)
const majorMap = {
  '00-TheFool.png': 'the-fool.png',
  '01-TheMagician.png': 'the-magician.png',
  '02-TheHighPriestess.png': 'the-high-priestess.png',
  '03-TheEmpress.png': 'the-empress.png',
  '04-TheEmperor.png': 'the-emperor.png',
  '05-TheHierophant.png': 'the-hierophant.png',
  '06-TheLovers.png': 'the-lovers.png',
  '07-TheChariot.png': 'the-chariot.png',
  '08-Strength.png': 'strength.png',
  '09-TheHermit.png': 'the-hermit.png',
  '10-WheelOfFortune.png': 'wheel-of-fortune.png',
  '11-Justice.png': 'justice.png',
  '12-TheHangedMan.png': 'the-hanged-man.png',
  '13-Death.png': 'death.png',
  '14-Temperance.png': 'temperance.png',
  '15-TheDevil.png': 'the-devil.png',
  '16-TheTower.png': 'the-tower.png',
  '17-TheStar.png': 'the-star.png',
  '18-TheMoon.png': 'the-moon.png',
  '19-TheSun.png': 'the-sun.png',
  '20-Judgement.png': 'judgement.png',
  '21-TheWorld.png': 'the-world.png',
  'CardBacks.png': 'card-back.png'
};

// 2. Định nghĩa số sang chữ cho các lá Ẩn Phụ (Minor Arcana)
const numberWords = {
  '01': 'ace',
  '02': 'two',
  '03': 'three',
  '04': 'four',
  '05': 'five',
  '06': 'six',
  '07': 'seven',
  '08': 'eight',
  '09': 'nine',
  '10': 'ten',
  '11': 'page',
  '12': 'knight',
  '13': 'queen',
  '14': 'king'
};

const suits = ['cups', 'wands', 'swords', 'pentacles'];

// Đọc tất cả file trong thư mục nguồn
const files = fs.readdirSync(srcDir);

let copiedCount = 0;

files.forEach(file => {
  let targetName = null;

  // Kiểm tra xem có thuộc Major Arcana không
  if (majorMap[file]) {
    targetName = majorMap[file];
  } else {
    // Kiểm tra Minor Arcana (Cups01.png, Wands01.png, ...)
    for (const suit of suits) {
      // Tìm suit không phân biệt chữ hoa thường ở đầu tên file
      const prefix = suit.charAt(0).toUpperCase() + suit.slice(1); // Cups, Wands...
      if (file.startsWith(prefix)) {
        // Tách phần số (ví dụ Cups01.png -> số 01)
        const numberPart = file.substring(prefix.length, prefix.length + 2);
        const word = numberWords[numberPart];
        if (word) {
          targetName = `${word}-of-${suit}.png`;
        }
        break;
      }
    }
  }

  if (targetName) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, targetName);
    
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${file} -> ${targetName}`);
    copiedCount++;
  } else {
    console.log(`Skipped: ${file} (No matching pattern)`);
  }
});

console.log(`\nSuccessfully copied ${copiedCount} files to ${destDir}`);
