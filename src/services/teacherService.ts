// ============================================
// TEACHER SERVICE
// Business logic untuk data guru
// ============================================

import { Guru, GuruFormData } from "@/types";
import * as sheets from "./googleSheets";

export async function getAllGuru(): Promise<Guru[]> {
  return sheets.getAllGuru() as unknown as Promise<Guru[]>;
}

export async function getGuruById(id: string): Promise<Guru | null> {
  const guruList = await getAllGuru();
  return guruList.find((g) => g.ID_Guru === id) || null;
}

export async function createGuru(data: GuruFormData): Promise<Guru> {
  const result = await sheets.createGuru(data as unknown as Record<string, unknown>);
  return {
    ID_Guru: (result as { ID_Guru: string }).ID_Guru,
    ...data,
    Created_At: new Date().toISOString(),
  };
}

export async function updateGuru(
  id: string,
  data: Partial<GuruFormData>
): Promise<Guru | null> {
  await sheets.updateGuru(id, data as Record<string, unknown>);
  return { ID_Guru: id, ...data } as Guru;
}

export async function deleteGuru(id: string): Promise<boolean> {
  // TODO: Implement delete
  return true;
}
