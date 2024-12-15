import { defineConfig } from 'vitepress'
import { getSidebar } from 'vitepress-plugin-auto-sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Fraymakers API Docs",
  description: "Unofficial Searchable Documentation for the Fraymakers API",
  base: '/fraymakers-api-docs/',
  ignoreDeadLinks: true,
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Classes', link: '/classes/' },
      { text: 'Hscript', link: '/hscript/' }
    ],
    search: {
      provider: 'local'
    },
    outline: {
      level: 'deep',
    },

    sidebar: [

      {
        text: 'Classes',
        link: '/classes/',
        collapsed: false,
        items: getSidebar({
          contentRoot: '/',
          contentDirs: ['docs/classes/'],
          collapsible: true,
          collapsed: false
        })
      },
      {
        text: 'Hscript',
        link: '/hscript/',
        collapsed: false,
        items: [
          { text: 'Variables', link: '/Variables/' },
          { text: 'Operators', link: '/Operators/' },
          { text: 'Blocks', link: '/Blocks/' },
          { text: 'If-Else', link: '/If/' },
          { text: 'Switch', link: '/Switch/' },
          { text: 'While', link: '/For/' },
          { text: 'Functions', link: '/Functions/' },
        ]
      }
    ],


    socialLinks: [
      { icon: 'github', link: 'https://github.com/shifterbit/fraymakers-api-docs' }
    ]
  }
})
