import { defineConfig } from 'vitepress'
import { getSidebar } from 'vitepress-plugin-auto-sidebar'
let classSidebar = getSidebar({
  contentRoot: '/',
  contentDirs: ['./docs/classes/'],
  collapsible: true,
  collapsed: false
})
for (let i = 0; i < classSidebar[0].items.length; i++) {
  classSidebar[0].items[i].link = classSidebar[0].items[i].link.replace("docs/", "");
}

console.dir(classSidebar, { depth: null });


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
      provider: 'local',
      options: {
        _render(src, env, md) {
          const html = md.render(src, env)
          if (env.frontmatter?.title)
            return md.render(`# ${env.frontmatter.title}`) + html
          return html
        }
      }

    },
    outline: {
      level: 'deep',
    },

    sidebar: [
      {
        text: 'Hscript',
        link: '/hscript/',
        collapsed: false,
        items: [
          { text: 'Variables', link: '/hscript/Variables/' },
          { text: 'Operators', link: '/hscript/Operators/' },
          { text: 'Blocks', link: '/hscript/Blocks/' },
          { text: 'If-Else', link: '/hscript/If/' },
          { text: 'Switch', link: '/hscript/Switch/' },
          { text: 'While', link: '/hscript/While/' },
          { text: 'For', link: '/hscript/For/' },
          { text: 'Array', link: '/hscript/Array/' },
          { text: 'String', link: '/hscript/String/' },
          { text: 'EventListeners', link: '/hscript/EventListeners/' },
          { text: 'StatusEffects', link: '/hscript/StatusEffects/' },
          { text: 'Timers', link: '/hscript/Timers/' },
          { text: 'Pseudo Classes', link: '/hscript/PseudoClasses/' },
          { text: 'Making Use of Ports and Arrays', link: '/hscript/MakingUseofPorts/' },
        ]
      },
      {
        text: 'Classes',
        link: '/classes',
        collapsed: false,
        items: classSidebar,
      }
    ],


    socialLinks: [
      { icon: 'github', link: 'https://github.com/shifterbit/fraymakers-api-docs' }
    ]
  }
})
