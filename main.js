const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Création de la fenêtre principale de l'application
  const win = new BrowserWindow({
    width: 1200, // Largeur confortable pour le tableau de bord
    height: 900, // Hauteur suffisante pour voir le graphique et le texte
    
    // On lie l'icône de l'application (le fichier icon.svg créé précédemment)
    icon: path.join(__dirname, 'gemini-svg.png'),
    
    webPreferences: {
      // Paramètres critiques pour permettre à renderer.js d'utiliser require()
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Charger l'interface utilisateur
  win.loadFile('index.html');

  // Optionnel : Supprimer la barre de menu par défaut (Fichier, Édition, etc.) 
  // pour un look d'application plus moderne. Décommentez la ligne suivante si vous le souhaitez :
  // win.setMenuBarVisibility(false);
}

// Lancer la création de la fenêtre quand Electron est prêt
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // Sur macOS, recréer une fenêtre quand on clique sur l'icône du dock
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Gérer la fermeture de l'application
app.on('window-all-closed', function () {
  // Quitter l'application si on n'est pas sur macOS
  if (process.platform !== 'darwin') app.quit();
});