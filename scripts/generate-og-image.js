/**
 * Script pour générer l'image OG (Open Graph) en PNG
 *
 * Prérequis : npm install canvas
 * Usage : node scripts/generate-og-image.js
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 630;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// Background gradient
const bgGradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
bgGradient.addColorStop(0, '#0a0a0a');
bgGradient.addColorStop(1, '#1a1a2e');
ctx.fillStyle = bgGradient;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Decorative circles
ctx.fillStyle = 'rgba(92, 224, 198, 0.03)';
ctx.beginPath();
ctx.arc(100, 100, 200, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(1100, 530, 250, 0, Math.PI * 2);
ctx.fill();

// Accent line
const accentGradient = ctx.createLinearGradient(100, 0, 180, 0);
accentGradient.addColorStop(0, '#5ce0c6');
accentGradient.addColorStop(1, '#64ffda');
ctx.fillStyle = accentGradient;
ctx.roundRect(100, 276, 80, 4, 2);
ctx.fill();

// Name
ctx.font = 'bold 72px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = '#5ce0c6';
ctx.fillText('Amazigh BELHADDAD', 100, 360);

// Title
ctx.font = '500 36px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = '#9ca3bd';
ctx.fillText('Développeur en formation', 100, 430);

// Tagline
ctx.font = '400 28px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = '#e0e0e0';
ctx.fillText("Je construis des projets concrets avec l'IA.", 100, 500);

// Logo/Initials
ctx.font = 'bold 48px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = '#5ce0c6';
ctx.fillText('AB', 1050, 120);

// Save to file
const outputPath = path.join(__dirname, '..', 'assets', 'images', 'og-image.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log('Image OG générée avec succès :', outputPath);
