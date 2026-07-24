export function drawRadarChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // data format: [{ axis: 'Gen AI', value: 0.8 }, ...]
    const size = 250;
    const center = size / 2;
    const radius = center - 40;

    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;

    // Draw grid
    const levels = 5;
    for (let j = 0; j < levels; j++) {
        let levelFactor = radius * ((j + 1) / levels);
        let pts = '';
        for (let i = 0; i < data.length; i++) {
            let angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
            let x = center + levelFactor * Math.cos(angle);
            let y = center + levelFactor * Math.sin(angle);
            pts += `${x},${y} `;
        }
        svg += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
    }

    // Draw axes
    for (let i = 0; i < data.length; i++) {
        let angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
        let x = center + radius * Math.cos(angle);
        let y = center + radius * Math.sin(angle);
        svg += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
        
        let labelX = center + (radius + 20) * Math.cos(angle);
        let labelY = center + (radius + 20) * Math.sin(angle);
        svg += `<text x="${labelX}" y="${labelY}" fill="#fff" font-size="10" text-anchor="middle" alignment-baseline="middle">${data[i].axis}</text>`;
    }

    // Draw data
    let pts = '';
    for (let i = 0; i < data.length; i++) {
        let angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
        let x = center + radius * data[i].value * Math.cos(angle);
        let y = center + radius * data[i].value * Math.sin(angle);
        pts += `${x},${y} `;
        svg += `<circle cx="${x}" cy="${y}" r="3" fill="#f0b429"/>`;
    }
    svg += `<polygon points="${pts}" fill="rgba(240,180,41,0.4)" stroke="#f0b429" stroke-width="2"/>`;

    svg += `</svg>`;
    container.innerHTML = svg;
}
