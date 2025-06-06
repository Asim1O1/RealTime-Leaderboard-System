import { Readable } from "stream";

// Utility to convert Buffer to stream
const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

export default bufferToStream;
