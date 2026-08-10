import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
import { searchIndex } from './src/data/branches.js'
import { feSearchIndex } from './src/data/feSubjects.js'

const subjectRoutes = [
  ...new Set([
    ...searchIndex.map(s => `/subject/${s.code}`),
    ...feSearchIndex.map(s => `/subject/${s.code}`),
  ])
]

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://sppustudyhub.in',
      dynamicRoutes: [
        '/',
        '/tools',
        '/news',
        '/first-year',
        '/branches',
        '/branches/cs',
        '/branches/it',
        '/branches/aids',
        '/branches/me',
        '/branches/ce',
        '/branches/ee',
        '/branches/etc',
        '/branches/aiml',
        '/syllabus',
        '/blog',
        '/about',
        '/contact',
        '/contributions',
        '/privacy',
        '/terms',
        ...subjectRoutes,
      ],
    })
  ]
})
