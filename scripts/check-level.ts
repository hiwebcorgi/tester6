
import { MemoryLevel } from 'memory-level'

const db = new MemoryLevel()
console.log('Has nextTick:', 'nextTick' in db)
console.log('Keys:', Object.keys(db))
console.log('Prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(db)))
