import { firefox } from 'playwright';
import { createWorker } from 'tesseract.js';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = false;
const hostname = 'localhost';
const port = 3456;

const OUTPUT_DIR = join(process.cwd(), 'scripts', 'ocr-output');

const PAGES = [
  { name: 'home', url: '/', waitFor: '#about' },
  { name: 'about', url: '/#about', waitFor: '#about' },
  { name: 'experience', url: '/#experience', waitFor: '#experience' },
  { name: 'projects', url: '/#projects', waitFor: '#projects' },
  { name: 'skills', url: '/#skills', waitFor: '#skills' },
  { name: 'contact', url: '/#contact', waitFor: '#contact' },
  { name: 'blog-index', url: '/blogs', waitFor: 'h1' },
  { name: 'blog-post', url: '/blogs/hello-world', waitFor: 'h1' },
  { name: '404', url: '/nonexistent-page', waitFor: 'h1' },
];

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('Starting Next.js production server...');
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();
  await app.prepare();

  const server = createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  });

  await new Promise((resolve) => server.listen(port, resolve));
  console.log(`Server ready on http://${hostname}:${port}`);

  console.log('Launching browser...');
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const worker = await createWorker('eng');
  const results = [];

  for (const page of PAGES) {
    console.log(`\n--- Processing: ${page.name} (${page.url}) ---`);
    const tab = await context.newPage();

    try {
      await tab.goto(`http://${hostname}:${port}${page.url}`, { waitUntil: 'networkidle', timeout: 30000 });

      if (page.waitFor) {
        await tab.waitForSelector(page.waitFor, { timeout: 10000 }).catch(() => {});
      }

      // Wait for animations to settle
      await tab.waitForTimeout(2000);

      const screenshotPath = join(OUTPUT_DIR, `${page.name}.png`);
      await tab.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  Screenshot saved: ${screenshotPath}`);

      const ocrResult = await worker.recognize(screenshotPath);
      const text = ocrResult.data.text.trim();
      const confidence = ocrResult.data.confidence;

      const textPath = join(OUTPUT_DIR, `${page.name}-ocr.txt`);
      writeFileSync(textPath, text);

      console.log(`  OCR Confidence: ${confidence.toFixed(1)}%`);
      console.log(`  Text length: ${text.length} chars`);
      console.log(`  First 200 chars: ${text.substring(0, 200)}`);

      // Check for professional content indicators
      const issues = [];
      if (text.length < 50) issues.push('Very little text detected - page may not have rendered');
      if (confidence < 60) issues.push(`Low OCR confidence (${confidence.toFixed(1)}%) - possible rendering issues`);

      // Check for placeholder text
      const placeholders = ['lorem ipsum', 'todo', 'fixme', 'placeholder'];
      for (const p of placeholders) {
        if (text.toLowerCase().includes(p)) issues.push(`Placeholder text found: "${p}"`);
      }

      // Check key content exists
      const keyContent = {
        home: ['Lance Abuan', 'Software Developer', 'About', 'Experience', 'Projects', 'Skills', 'Contact'],
        about: ['About', 'Who'],
        experience: ['Experience', 'Work'],
        projects: ['Projects', 'Built'],
        skills: ['Skills', 'What I work with'],
        contact: ['Contact', 'Connect'],
        'blog-index': ['Blog'],
        'blog-post': ['Hello World', 'Hello'],
        '404': ['404', 'not found'],
      };

      const expected = keyContent[page.name] || [];
      for (const word of expected) {
        if (!text.toLowerCase().includes(word.toLowerCase())) {
          issues.push(`Expected text "${word}" not found`);
        }
      }

      results.push({
        page: page.name,
        url: page.url,
        confidence: confidence.toFixed(1),
        textLength: text.length,
        firstLines: text.split('\n').slice(0, 5).join(' | '),
        issues,
        status: issues.length === 0 ? 'PASS' : 'WARNING',
      });
    } catch (err) {
      console.error(`  Error: ${err.message}`);
      results.push({
        page: page.name,
        url: page.url,
        confidence: '0',
        textLength: 0,
        firstLines: '',
        issues: [`Error: ${err.message}`],
        status: 'ERROR',
      });
    } finally {
      await tab.close();
    }
  }

  await worker.terminate();
  await browser.close();
  server.close();

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('OCR VERIFICATION SUMMARY');
  console.log('='.repeat(80));

  const passed = results.filter(r => r.status === 'PASS').length;
  const warned = results.filter(r => r.status === 'WARNING').length;
  const errors = results.filter(r => r.status === 'ERROR').length;

  for (const r of results) {
    const icon = r.status === 'PASS' ? '✓' : r.status === 'WARNING' ? '⚠' : '✗';
    console.log(`\n${icon} ${r.page} (${r.url})`);
    console.log(`  Confidence: ${r.confidence}% | Text: ${r.textLength} chars`);
    console.log(`  Preview: ${r.firstLines.substring(0, 120)}`);
    if (r.issues.length > 0) {
      for (const issue of r.issues) {
        console.log(`  ⚠ ${issue}`);
      }
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`Total: ${results.length} | Passed: ${passed} | Warnings: ${warned} | Errors: ${errors}`);
  console.log('='.repeat(80));

  const reportPath = join(OUTPUT_DIR, 'report.json');
  writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nFull report saved to: ${reportPath}`);

  process.exit(errors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
