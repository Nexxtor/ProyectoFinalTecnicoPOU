const STORAGE_KEY = 'eventos-db-v1';

let dbPromise = null;

export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

async function loadSeed() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/seed.json`);
  if (!response.ok) {
    throw new Error('No se pudieron cargar los datos iniciales.');
  }
  return response.json();
}

export async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      const seed = await loadSeed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    })();
  }
  return dbPromise;
}

export function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  dbPromise = Promise.resolve(db);
}

export async function read(reader) {
  await delay(220);
  const db = await getDb();
  return clone(await reader(db));
}

export async function mutate(mutator) {
  await delay(320);
  const db = await getDb();
  const result = await mutator(db);
  saveDb(db);
  return clone(result);
}

export function resetDb() {
  localStorage.removeItem(STORAGE_KEY);
  dbPromise = null;
}

export { STORAGE_KEY };
