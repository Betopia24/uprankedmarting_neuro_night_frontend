export type AudioFile = {
  id: string;
  name: string;
  size: number;
  duration?: number; // seconds
  src: string; // local object URL or remote URL
  createdAt: Date;
};
