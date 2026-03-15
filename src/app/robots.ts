import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/new',
          '/upload',
          '/processing/',
          '/sign-in',
          '/sign-up',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://backdropimage.com/sitemap.xml',
  }
}
