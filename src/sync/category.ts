import * as db from '../db/index.js'
export async function syncCategory(data: string[]) {
  for (const c of data) {
    await db.query(
      `
  INSERT INTO category (type)
  VALUES($1)
  ON CONFLICT (type) DO NOTHING
  `,
      [c]
    )
  }
}
