import { describe, it, expect } from 'vitest'
import { createSessionToken, verifySessionToken } from '../src/lib/auth'
import { resolveUploadFile, detectImageExtension } from '../src/lib/uploads'
import { validateProjectInput } from '../src/lib/security'

describe('session and upload boundaries', () => {
  it('accepts signed tokens and rejects tampering', async () => {
    const token = await createSessionToken('admin')
    expect(await verifySessionToken(token!)).toBe('admin')
    expect(await verifySessionToken(token! + 'tampered')).toBeNull()
    expect(await verifySessionToken(undefined)).toBeNull()
  })
  it('rejects upload traversal and trusts file signatures rather than extensions', () => {
    expect(resolveUploadFile('../../private.txt')).toBeNull()
    expect(detectImageExtension(Buffer.from('<script>bad</script>'))).toBeNull()
    expect(detectImageExtension(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))).toBe('.png')
  })
  it('rejects executable project links', () => {
    expect(validateProjectInput({name:'Example',description:'Demo',technologies:['TS'],github:'javascript:alert(1)'})).not.toBeNull()
  })
})
