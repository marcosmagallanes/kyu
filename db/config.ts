import { defineDb, defineTable, column } from "astro:db";

const Surah = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
  },
});

const Ayah = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    text: column.text(),
  },
  indexes: [{ on: ["text"] }],
});

const Juz = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
  },
});

const Juz_Ayah = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    juz_id: column.number({ references: () => Juz.columns.id }),
    ayah_id: column.number({ references: () => Ayah.columns.id }),
  },
});

const Dictionary = defineTable({
  columns: {
    word: column.text({ primaryKey: true }),
    count: column.number(),
  },
});

export default defineDb({
  tables: {
    Ayah,
    Dictionary,
    Juz,
    Juz_Ayah,
  },
});
