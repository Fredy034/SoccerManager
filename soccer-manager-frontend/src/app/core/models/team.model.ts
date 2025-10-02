export interface Team {
  id: number;
  name: string;
  country?: string | null;
  city?: string | null;
  shieldUrl?: string | null;
  creationDate?: string | Date | null;
  active?: boolean | null;
}
