const XLSX = require('xlsx');
const Chart = require('chart.js/auto');
const html2canvas = require('html2canvas');

let myChart = null;
let donneesAnalysees = [];

// Fonction pour déterminer la couleur selon la valeur
function getCouleur(valeur) {
    if (valeur >= 70) return 'rgba(40, 167, 69, 0.8)';   // Vert
    if (valeur >= 50) return 'rgba(255, 165, 0, 0.8)';   // Orange
    return 'rgba(220, 53, 69, 0.8)';                     // Rouge
}

// 1. Gérer l'importation
document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    document.getElementById('fileName').innerText = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 7, defval: "" });
        analyserDonnees(jsonData);
        document.getElementById('exportBtn').style.display = 'inline-block';
        document.getElementById('downloadImgBtn').style.display = 'inline-block';
    };
    reader.readAsArrayBuffer(file);
});

// 2. Analyse et Regroupement
function analyserDonnees(data) {
    const directions = {};
    let totalCibleGlobal = 0;
    let totalActuelGlobal = 0;

    data.forEach(row => {
        const cleanRow = {};
        for (let key in row) { cleanRow[key.trim()] = row[key]; }
        const dir = cleanRow['م. الاقليمية'];
        if (!dir) return;
        const cible = parseFloat(cleanRow['القيمة المستهدفة']) || 0;
        const actuel = parseFloat(cleanRow['القيمة الحالية']) || 0;
        
        if (!directions[dir]) directions[dir] = { c: 0, a: 0 };
        directions[dir].c += cible;
        directions[dir].a += actuel;
        
        totalCibleGlobal += cible;
        totalActuelGlobal += actuel;
    });

    // Création d'un tableau triable
    let sortable = [];
    for (const [name, val] of Object.entries(directions)) {
        const p = val.c > 0 ? parseFloat(((val.a / val.c) * 100).toFixed(2)) : 0;
        sortable.push({ name: name, p: p, c: val.c, a: val.a });
    }

    // TRI DÉCROISSANT (des plus grandes valeurs aux plus petites)
    sortable.sort((a, b) => b.p - a.p);

    const labels = [];
    const pcts = [];
    const bgColors = [];
    donneesAnalysees = [];

    // Ajouter les directions triées
    sortable.forEach(item => {
        labels.push(item.name);
        pcts.push(item.p);
        bgColors.push(getCouleur(item.p));
        donneesAnalysees.push({ 'المديرية الإقليمية': item.name, 'القيمة المستهدفة': item.c, 'القيمة الحالية': item.a, 'النسبة المئوية (%)': item.p });
    });

    // Ajouter Total AREF (toujours à la fin)
    const pctTotalAREF = totalCibleGlobal > 0 ? parseFloat(((totalActuelGlobal / totalCibleGlobal) * 100).toFixed(2)) : 0;
    labels.push('المعدل الجهوي (AREF)');
    pcts.push(pctTotalAREF);
    bgColors.push(getCouleur(pctTotalAREF));

    donneesAnalysees.push({ 'المديرية الإقليمية': 'المعدل الجهوي (AREF)', 'القيمة المستهدفة': totalCibleGlobal, 'القيمة الحالية': totalActuelGlobal, 'النسبة المئوية (%)': pctTotalAREF });

    dessinerGraphique(labels, pcts, bgColors);
}

// 3. Dessiner le graphique
function dessinerGraphique(labels, data, bgColors) {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChart) myChart.destroy();

    Chart.defaults.animation = false;
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: bgColors,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 110 } },
            animation: {
                onComplete: function() {
                    const chartInstance = this;
                    const ctx = chartInstance.ctx;
                    ctx.font = 'bold 14px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillStyle = '#000';
                    this.data.datasets.forEach(function(dataset, i) {
                        const meta = chartInstance.getDatasetMeta(i);
                        meta.data.forEach(function(bar, index) {
                            ctx.fillText(dataset.data[index] + '%', bar.x, bar.y - 5);
                        });
                    });
                }
            }
        }
    });
}

// 4. Capture du rapport
document.getElementById('downloadImgBtn').addEventListener('click', () => {
    const captureArea = document.getElementById('capture-area');
    captureArea.classList.add('capturing');
    html2canvas(captureArea, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
        captureArea.classList.remove('capturing');
        const link = document.createElement('a');
        link.download = 'Rapport_AREF_Analyse.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

// 5. Export Excel
document.getElementById('exportBtn').addEventListener('click', () => {
    const ws = XLSX.utils.json_to_sheet(donneesAnalysees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analyse");
    XLSX.writeFile(wb, "Analyse_Directions_AREF.xlsx");
});