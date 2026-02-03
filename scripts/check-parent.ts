
import { MemoryLevel } from 'memory-level'

const db = new MemoryLevel()
console.log('parent in db:', 'parent' in db)
console.log('db.parent:', (db as any).parent)
console.log('parent type:', typeof (db as any).parent)

class LevelOnePolyfill extends MemoryLevel {
    parent() { return null }
}
const poly = new LevelOnePolyfill()
console.log('poly.parent type:', typeof poly.parent)
