// app/page.tsx - Server Component
import LandingPageClient from './LandingPageClient';
import fs from 'fs';
import path from 'path';

export default async function LandingPage() {
    // Determine language (default to 'ko')
    const currentLang = process.env.DEPLOY_LANGUAGE || 'ko';

    // Load content directly from JSON file
    const homeJsonPath = path.join(process.cwd(), 'content', currentLang, 'home.json');
    let homeData = {};
    try {
        homeData = JSON.parse(fs.readFileSync(homeJsonPath, 'utf-8'));
    } catch (error) {
        console.error(`Failed to load home.json from ${homeJsonPath}:`, error);
        // Fallback to default language if specific language file fails
        if (currentLang !== 'ko') {
            try {
                const fallbackPath = path.join(process.cwd(), 'content', 'ko', 'home.json');
                homeData = JSON.parse(fs.readFileSync(fallbackPath, 'utf-8'));
            } catch (e) {
                console.error('Failed to load fallback home.json:', e);
            }
        }
    }

    // Load modules configuration (Global)
    const modulesJsonPath = path.join(process.cwd(), 'content', 'modules.json');
    let modules = { modules: [] };
    try {
        modules = JSON.parse(fs.readFileSync(modulesJsonPath, 'utf-8'));
    } catch (error) {
        console.error(`Failed to load modules.json from ${modulesJsonPath}:`, error);
    }

    // Load global settings (Global)
    const settingsJsonPath = path.join(process.cwd(), 'content', currentLang, 'settings.json');
    let settings = {};
    try {
        if (fs.existsSync(settingsJsonPath)) {
            settings = JSON.parse(fs.readFileSync(settingsJsonPath, 'utf-8'));
        }
    } catch (error) {
        console.error(`Failed to load settings.json from ${settingsJsonPath}:`, error);
    }

    return <LandingPageClient data={homeData} />;
}