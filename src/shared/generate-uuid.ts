import { v4 as uuidv4 } from "uuid";

const generateShortUuid = (): string => uuidv4().substring(0, 8);
const generateUuid = (): string => uuidv4();

export { generateShortUuid, generateUuid };
