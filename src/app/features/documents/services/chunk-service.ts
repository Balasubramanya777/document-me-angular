import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChunkService {

  private WINDOW_SIZE = 48;
  private BOUNDARY_MASK = 0x3FF;
  private BASE = 257;
  private MOD = 2 ** 32;
  private createCounter: number = 0;

  createChunkText(text: string): { slNo: number; content: string; }[] {
    this.createCounter = 0;
    const chunks: { slNo: number; content: string; }[] = [];

    let windowStart = 0;
    let hash = 0;
    let highBase = 1;

    for (let i = 1; i < this.WINDOW_SIZE; i++) {
      highBase = (highBase * this.BASE) % this.MOD;
    }

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      hash = (hash * this.BASE + charCode) % this.MOD;
      if (i - windowStart >= this.WINDOW_SIZE) {
        const oldChar = text.charCodeAt(i - this.WINDOW_SIZE);
        hash = (hash + this.MOD - (oldChar * highBase) % this.MOD) % this.MOD;
      }

      if ((hash & this.BOUNDARY_MASK) === 0 || i === text.length - 1) {

        const content = text.slice(windowStart, i + 1);

        chunks.push({
          slNo: this.createCounter++,
          content: content
        });

        windowStart = i + 1;
      }
    }

    return chunks;
  }

  // ---------------------------------------------------------
  // 1) Chunk text using rolling hash (async)
  // ---------------------------------------------------------
  async chunkText(text: string): Promise<{ id: string; content: string; hash: string }[]> {
    const chunks: { id: string; content: string; hash: string }[] = [];

    let windowStart = 0;
    let hash = 0;
    let highBase = 1;

    for (let i = 1; i < this.WINDOW_SIZE; i++) {
      highBase = (highBase * this.BASE) % this.MOD;
    }

    for (let i = 0; i < text.length; i++) {

      const charCode = text.charCodeAt(i);

      hash = (hash * this.BASE + charCode) % this.MOD;

      if (i - windowStart >= this.WINDOW_SIZE) {
        const oldChar = text.charCodeAt(i - this.WINDOW_SIZE);
        hash = (hash + this.MOD - (oldChar * highBase) % this.MOD) % this.MOD;
      }

      if ((hash & this.BOUNDARY_MASK) === 0 || i === text.length - 1) {

        const content = text.slice(windowStart, i + 1);
        const chunkHash = await this.sha256(content);
        const id = chunkHash.substring(0, 16);

        chunks.push({
          id: id,
          content: content,
          hash: chunkHash
        });

        windowStart = i + 1;
      }
    }

    return chunks;
  }

  // ---------------------------------------------------------
  // 2) Compute SHA-256 hash
  // ---------------------------------------------------------
  private async sha256(str: string): Promise<string> {
    const buffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(str)
    );

    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // ---------------------------------------------------------
  // 3) Sort chunks lexicographically
  // ---------------------------------------------------------
  // sortChunks(chunks: { id: string }[]) {
  //   return chunks.sort((a, b) => a.id.localeCompare(b.id));
  // }

  // // ---------------------------------------------------------
  // // 4) Compute diff (without sending hash to backend)
  // // ---------------------------------------------------------
  // getChunkDiff(
  //   oldChunks: { id: string; hash: string }[],
  //   newChunks: { id: string; hash: string; content: string }[]
  // ) {
  //   const create: { id: string; content: string }[] = [];
  //   const update: { id: string; content: string }[] = [];
  //   const deleted: string[] = [];

  //   const oldMap = new Map(oldChunks.map(c => [c.id, c]));
  //   const newMap = new Map(newChunks.map(c => [c.id, c]));

  //   // CREATE + UPDATE
  //   for (const newChunk of newChunks) {
  //     const oldChunk = oldMap.get(newChunk.id);

  //     if (!oldChunk) {
  //       create.push({ id: newChunk.id, content: newChunk.content });
  //     } else if (oldChunk.hash !== newChunk.hash) {
  //       update.push({ id: newChunk.id, content: newChunk.content });
  //     }
  //   }

  //   // DELETE
  //   for (const oldChunk of oldChunks) {
  //     if (!newMap.has(oldChunk.id)) {
  //       deleted.push(oldChunk.id);
  //     }
  //   }

  //   return {
  //     create: create,
  //     update: update,
  //     delete: deleted
  //   };
  // }
}
