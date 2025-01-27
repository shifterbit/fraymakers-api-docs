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
        text: 'Haxescript',
        link: '/hscript/',
        collapsed: false,
        items: [
          {
            text: "Syntax",
            link: "/hscript/syntax",
            items: [
              { text: 'Variables', link: '/hscript/syntax/Variables/' },
              { text: 'Operators', link: '/hscript/syntax/Operators/' },
              { text: 'Blocks', link: '/hscript/syntax/Blocks/' },
              { text: 'If-Else', link: '/hscript/syntax/If/' },
              { text: 'Switch', link: '/hscript/syntax/Switch/' },
              { text: 'While', link: '/hscript/syntax/While/' },
              { text: 'For', link: '/hscript/syntax/For/' },
              { text: 'Functions', link: '/hscript/syntax/Functions/' },
              { text: 'Type Annotations', link: '/hscript/syntax/TypeAnnotations/' }
            ]
          },
          {
            text: "Builtins",
            link: "/hscript/builtins",
            items: [
              { text: 'Array', link: '/hscript/builtins/Array/' },
              { text: 'String', link: '/hscript/builtins/String/' },
            ]
          },
          {
            text: "Fraymakers Specific Guides",
            link: "/hscript/fray",
            items: [
              { text: 'Event Listeners', link: '/hscript/fray/EventListeners/' },
              { text: 'Status Effects', link: '/hscript/fray/StatusEffects/' },
              { text: 'Timers', link: '/hscript/fray/Timers/' },
              { text: 'Pseudo Classes', link: '/hscript/fray/PseudoClasses/' },
              { text: 'Making Use of Ports and Arrays', link: '/hscript/fray/MakingUseOfPorts/' },
            ]
          },
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
