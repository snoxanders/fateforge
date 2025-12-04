const fs = require('fs');
const https = require('https');
const path = require('path');

const downloadImage = (url, filename) => {
  // Ajustando o caminho: backend/scripts -> backend/frontend/public/assets/races
  const filepath = path.join(__dirname, '../frontend/public/assets/races', filename);
  
  // Garantir que o diretório existe
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }

  const file = fs.createWriteStream(filepath);

  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', (err) => {
    fs.unlink(filepath, () => {}); 
    console.error(`Error downloading ${filename}: ${err.message}`);
  });
};

const images = [
  { url: 'https://raw.githubusercontent.com/wesnoth/wesnoth/master/data/core/images/portraits/humans/lieutenant.png', name: 'human.png' },
  { url: 'https://raw.githubusercontent.com/wesnoth/wesnoth/master/data/core/images/portraits/elves/high-lord.png', name: 'elf.png' },
  { url: 'https://raw.githubusercontent.com/wesnoth/wesnoth/master/data/core/images/portraits/dwarves/runemaster.png', name: 'dwarf.png' },
  { url: 'https://raw.githubusercontent.com/wesnoth/wesnoth/master/data/core/images/portraits/humans/footpad.png', name: 'halfling.png' },
  { url: 'https://raw.githubusercontent.com/wesnoth/wesnoth/master/data/core/images/portraits/orcs/warrior.png', name: 'orc.png' },
  { url: 'https://raw.githubusercontent.com/wesnoth/wesnoth/master/data/core/images/portraits/undead/dark-sorcerer.png', name: 'tiefling.png' }
];

console.log("Iniciando download das imagens...");
images.forEach(img => downloadImage(img.url, img.name));

