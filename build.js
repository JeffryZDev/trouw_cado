const fs = require('fs');
const path = require('path');

const MEDIA_DIR = './media';
const HTML_FILE = './index.html';

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];
const VIDEO_EXTS = ['.mp4', '.mov', '.webm', '.ogg', '.avi'];

if (!fs.existsSync(MEDIA_DIR)) {
    fs.mkdirSync(MEDIA_DIR);
    console.log('Created /media folder.');
}

const files = fs.readdirSync(MEDIA_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return IMAGE_EXTS.includes(ext) || VIDEO_EXTS.includes(ext);
});

const mediaItems = files.map(f => {
    const ext = path.extname(f).toLowerCase();
    const type = IMAGE_EXTS.includes(ext) ? 'image' : 'video';
    return { type, src: `media/${f}` };
});

console.log(`Found ${mediaItems.length} media file(s) in /media.`);

let html = fs.readFileSync(HTML_FILE, 'utf8');

const marker = '// GENERATED_MEDIA_START';
const markerEnd = '// GENERATED_MEDIA_END';

const newBlock = `${marker}\n            preloadedMedia: ${JSON.stringify(mediaItems, null, 12).replace(/^/gm, '            ').trim()},\n            ${markerEnd}`;

if (html.includes(marker)) {
    html = html.replace(new RegExp(`${marker}[\\s\\S]*?${markerEnd}`), newBlock);
} else {
    html = html.replace('preloadedMedia: [', `${marker}\n            preloadedMedia: [`);
    html = html.replace(/preloadedMedia: \[[\s\S]*?\]/, 
        `preloadedMedia: ${JSON.stringify(mediaItems, null, 12).replace(/^/gm, '            ').trim()},\n            ${markerEnd}`
    );
}

fs.writeFileSync(HTML_FILE, html, 'utf8');
console.log('index.html updated. Ready to push to GitHub!');