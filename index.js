const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// ২০০০ মেটাডাটার লিস্ট (স্যাম্পল হিসেবে নিচে কয়েকটি দেওয়া হলো)
const nftMetadataList = [
    {"id": 1501, "layers": {"Background": 1, "Base": 3, "Eyes": 4, "Mouth": 2}},
    {"id": 1502, "layers": {"Background": 2, "Base": 9, "Eyes": 9, "Mouth": 5}},
    {"id": 1503, "layers": {"Background": 3, "Base": 5, "Eyes": 2, "Mouth": 1}},
    // আপনার বাকি মেটাডাটাগুলো এখানে একইভাবে যুক্ত হবে...
];

// ছবির সাইজ (আপনার ছবির আসল সাইজ অনুযায়ী এটি পরিবর্তন করতে পারেন, যেমন ২৪ বা ১০০০)
const width = 1000;
const height = 1000;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// লেয়ার সাজানোর সিরিয়াল বা অর্ডার
const layerOrder = ["Background", "Base", "Eyes", "Mouth"];

async function generateNFT(nftData) {
    const nftId = nftData.id;
    const traits = nftData.layers;

    // ক্যানভাস পরিষ্কার করা
    ctx.clearRect(0, 0, width, height);

    // একটার ওপর আরেকটা লেয়ার বসানো
    for (const layerName of layerOrder) {
        if (traits[layerName]) {
            const fileNum = traits[layerName];
            const imagePath = `./layers/${layerName}/${fileNum}.png`;

            if (fs.existsSync(imagePath)) {
                const img = await loadImage(imagePath);
                ctx.drawImage(img, 0, 0, width, height);
            }
        }
    }

    // ছবি সেভ করার ফোল্ডার তৈরি করা
    if (!fs.existsSync('./build')) fs.mkdirSync('./build');

    // ফাইনাল ছবি ইমেজ ফাইলে রূপান্তর করে সেভ করা
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./build/${nftId}.png`, buffer);
    console.log(`Successfully Generated NFT #${nftId}`);
}

async function start() {
    for (const nft of nftMetadataList) {
        await generateNFT(nft);
    }
    console.log("All Punks Generated Successfully inside './build' folder!");
}

start();
