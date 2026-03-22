/**
 * PieFiles.com - Main Entry Point
 * A humorous parody of GameFront.com with retro PieFiles theme
 */

import './components/pie-app.js';

// Initialize the app
const app = document.getElementById('app');
if (app) {
    app.innerHTML = '<pie-app></pie-app>';
}
