# Analyseur-AREF-F-s-Mekn-s
📝 Description
Analyseur AREF est une application de bureau développée pour automatiser le suivi des indicateurs de performance (KPI) des directions provinciales de l'Académie Régionale de l'Éducation et de la Formation (AREF) de Fès-Meknès.

Cette solution permet de convertir des données brutes issues de fichiers Excel en rapports visuels dynamiques, facilitant ainsi la prise de décision.

🚀 Fonctionnalités principales
Traitement Automatisé : Importation et agrégation de fichiers Excel.

Visualisation Dynamique : Génération de graphiques en barres (triés par performance) avec étiquetage automatique.

Indicateurs "Feu Tricolore" : Analyse visuelle instantanée des performances (Vert ≥ 70%, Orange 50-69%, Rouge < 50%).

Exportation Professionnelle : Génération de rapports visuels (PNG) avec en-têtes officiels et commentaires modifiables, ainsi que des exports de données (Excel).

🛠️ Stack Technique
Electron.js : Pour le développement de l'application de bureau multiplateforme.

Chart.js : Pour la visualisation des données et les graphiques interactifs.

XLSX (SheetJS) : Pour la manipulation et l'analyse des fichiers Excel.

Html2Canvas : Pour la capture et l'exportation des rapports en haute résolution.

📁 Structure du projet
Plaintext
├── build/              # Ressources graphiques (logos)
├── dist/               # Fichiers exécutables (.exe) générés
├── src/                # Code source
├── main.js             # Configuration du processus principal Electron
├── renderer.js         # Logique d'analyse et génération graphique
└── index.html          # Interface utilisateur
👨‍💻 Auteur
Mehdi Boutmizgida

Étudiant en DUT Informatique Décisionnelle (EST Fès).

Développé dans le cadre d'un stage à l'AREF Fès-Meknès (2026).
