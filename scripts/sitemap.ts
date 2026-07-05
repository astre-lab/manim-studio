// scripts/sitemap.ts
import { ensureDir } from 'https://deno.land/std@0.208.0/fs/ensure_dir.ts';
import { join } from 'https://deno.land/std@0.208.0/path/join.ts';
import { animations } from '../src/lib/animations/registry.ts';

const BASE_URL = Deno.env.get('BASE_URL') || 'https://manim-studio.pages.dev';

interface SitemapUrl {
  path: string;
  priority: number;
  changefreq: string;
  lastmod: string;
}

function getRandomChangefreq(): string {
  const frequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
  return frequencies[Math.floor(Math.random() * frequencies.length)];
}

function getSitemapUrls(): SitemapUrl[] {
  const today = new Date().toISOString().split('T')[0];
  
  const staticRoutes: SitemapUrl[] = [
    { path: '/', priority: 1.0, changefreq: getRandomChangefreq(), lastmod: today },
    { path: '/animations', priority: 0.9, changefreq: getRandomChangefreq(), lastmod: today },
  ];

  const animationRoutes: SitemapUrl[] = animations.map(anim => ({
    path: anim.path,
    priority: anim.seo?.priority || 0.8,
    changefreq: getRandomChangefreq(),
    lastmod: today,
  }));

  return [...staticRoutes, ...animationRoutes];
}

function generateSitemapXml(urls: SitemapUrl[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${BASE_URL}${url.path}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

async function main() {
  try {
    console.log('🔄 Generating sitemap with random frequencies...');
    
    const urls = getSitemapUrls();
    const sitemap = generateSitemapXml(urls);
    
    await ensureDir('./static');
    
    const outputPath = join(Deno.cwd(), 'static', 'sitemap.xml');
    await Deno.writeFile(outputPath, new TextEncoder().encode(sitemap));
    
    console.log(`✅ Sitemap generated at ${outputPath}`);
    console.log(`📊 Total URLs: ${urls.length}`);
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}