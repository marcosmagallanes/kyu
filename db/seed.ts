import allayah from "./allayah.json";

import { db, Ayah, Dictionary, Juz, Juz_Ayah } from "astro:db";

export default async function () {
  console.time("Seeding Time");

  const wordCounts: Map<string, number> = new Map();

  // Insert Ayah in parallel batches
  const ayahBatches = [];
  for (let i = 0; i < allayah.length; i += 1000) {
    const batch = allayah.slice(i, i + 1000);
    ayahBatches.push(db.insert(Ayah).values(batch));
  }
  await Promise.allSettled(ayahBatches);

  // Count words using Map for better performance
  for (const ayah of allayah) {
    const words = ayah.text.split(/\s+/); // Using regex to split on any whitespace
    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  // Convert Map to array for batch insertion
  const wordCountsArray = Array.from(wordCounts.entries()).map(
    ([word, count]) => ({ word, count })
  );

  // Insert Dictionary in parallel batches
  const dictionaryBatches = [];
  for (let i = 0; i < wordCountsArray.length; i += 1000) {
    const batch = wordCountsArray.slice(i, i + 1000);
    dictionaryBatches.push(db.insert(Dictionary).values(batch));
  }
  await Promise.allSettled(dictionaryBatches);

  await db
    .insert(Juz)
    .values(Array.from({ length: 114 }, (_, i) => ({ id: i + 1 })));

  console.timeEnd("Seeding Time");
}
