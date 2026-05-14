declare module "multer" {
  import type { IncomingMessage } from "node:http";

  type Callback = (error: Error | null, acceptFile?: boolean) => void;

  interface FileFilterCallback {
    (req: IncomingMessage, file: { mimetype: string; originalname: string }, cb: Callback): void;
  }

  interface Options {
    storage?: unknown;
    limits?: {
      fileSize?: number;
      files?: number;
    };
    fileFilter?: FileFilterCallback;
  }

  interface Multer {
    any(): (req: IncomingMessage, res: unknown, callback: (error?: unknown) => void) => void;
  }

  interface MulterStatic {
    (options?: Options): Multer;
    memoryStorage(): unknown;
  }

  const multer: MulterStatic;
  export default multer;
}
