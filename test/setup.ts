import { rm } from 'node:fs/promises'
import { join } from 'node:path'

// after set "setupFilesAfterEnv": ["<rootDir>/setup.ts"] in jest-e2e.json
global.beforeEach(async () => {
  try {
    // __dirname - is a reference to the test folder that this setup.ts file is in
    // '..' - go up one directory
    // 'test.sqlite' - find this file
    await rm(join(__dirname, '..', 'test.sqlite'))
  } catch (error) { }
})