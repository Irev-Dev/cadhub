/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'CadHub',
  tagline: '',
  url: 'https://learn.cadhub.xyz',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.svg',
  organizationName: 'IrevDev', // Usually your GitHub org/user name.
  projectName: 'Cadhub', // Usually your repo name.
  plugins: ['@docusaurus/plugin-ideal-image', 'docusaurus-tailwindcss-loader'],
  themeConfig: {
    navbar: {
      title: 'CadHub',
      logo: {
        alt: 'CadHub Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/Irev-Dev/cadhub',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'http://cadhub.xyz/',
          label: 'Main App',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Road Map',
              href: 'https://github.com/Irev-Dev/cadhub/discussions/212',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/SD7zFRNjGH',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/IrevDev',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Irev-Dev/cadhub',
            },
            {
              label: 'Main App',
              href: 'http://cadhub.xyz/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kurt Hutten. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/Irev-Dev/cadhub/blob/main/docs/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/Irev-Dev/cadhub/blob/main/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
