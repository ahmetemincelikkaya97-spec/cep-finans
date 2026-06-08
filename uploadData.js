import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';
import { readFileSync } from 'fs';
import path from 'path';

// Import local data
import { recipes, categories } from './src/data/recipes.js';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'tadora-c2ef8.firebasestorage.app'
});

const db = getFirestore();
const bucket = getStorage().bucket();

async function uploadImage(localPath, destination) {
    try {
        const [file] = await bucket.upload(localPath, {
            destination: destination,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            }
        });
        
        const url = await getDownloadURL(file);
        return url;
    } catch (err) {
        console.error(`Resim yüklenemedi ${localPath}:`, err.message);
        return null;
    }
}

async function run() {
    console.log('Firebase taşıma işlemi başlatılıyor...');
    
    // 1. Kategorileri yükle
    console.log('Kategoriler Firestore\'a yükleniyor...');
    let batch = db.batch();
    for (const cat of categories) {
        const catRef = db.collection('categories').doc(cat.id);
        batch.set(catRef, cat);
    }
    await batch.commit();
    console.log('Kategoriler yüklendi.');

    // 2. Resimleri Storage'a ve Tarifleri Firestore'a yükle
    console.log(`Toplam ${recipes.length} tarif işleniyor...`);
    batch = db.batch();
    let count = 0;
    
    for (const recipe of recipes) {
        let imageUrl = recipe.image;
        if (imageUrl && imageUrl.startsWith('/images/')) {
            const localPath = path.join(process.cwd(), 'public', imageUrl);
            // Decode the URI component to handle spaces in filenames correctly when reading from local system
            const decodedLocalPath = decodeURIComponent(localPath);
            const destination = `images/${path.basename(decodedLocalPath)}`;
            
            console.log(`Yükleniyor: ${destination}...`);
            const uploadedUrl = await uploadImage(decodedLocalPath, destination);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            }
        }
        
        const updatedRecipe = { ...recipe, image: imageUrl };
        const recipeRef = db.collection('recipes').doc(recipe.id.toString());
        batch.set(recipeRef, updatedRecipe);
        
        count++;
        // Firestore batch sınırı (500)
        if (count % 400 === 0) {
            await batch.commit();
            batch = db.batch();
        }
    }
    
    // Kalan verileri commit et
    if (count % 400 !== 0) {
        await batch.commit();
    }
    
    console.log('TÜM İŞLEMLER BAŞARIYLA TAMAMLANDI!');
    process.exit(0);
}

run().catch(err => {
    console.error('HATA OLUŞTU:', err);
    process.exit(1);
});
