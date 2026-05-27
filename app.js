// ============================================
// APEX Cover Generator — Application Logic
// ============================================

// STATE
const state = {
    image: null,         // { file, url, img (loaded Image object) }
    selectedTemplate: 1,
    showPrice: true,
    showPhone: true,
    logoImg: null,
};

// Load logo
const logoImage = new Image();
logoImage.crossOrigin = 'anonymous';
logoImage.onload = () => { state.logoImg = logoImage; };
logoImage.src = 'logo-transparent.png';

// ============================================
// IMAGE UPLOAD
// ============================================
const fileInput = document.getElementById('fileInput');
const uploadZone = document.getElementById('uploadZone');

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    loadImage(file);
    e.target.value = '';
});

// Drag and drop
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    loadImage(file);
});

function loadImage(file) {
    // Revoke previous URL if exists
    if (state.image) {
        URL.revokeObjectURL(state.image.url);
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
        state.image = { file, url, img };
        showImageThumb();
        showPreview();
        renderCover();
    };
    img.src = url;
}

function showImageThumb() {
    const area = document.getElementById('imagePreviewArea');
    const thumbContainer = document.getElementById('currentImageThumb');
    area.style.display = 'block';
    uploadZone.style.display = 'none';

    thumbContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = state.image.url;
    thumbContainer.appendChild(img);
}

function removeImage() {
    if (state.image) {
        URL.revokeObjectURL(state.image.url);
        state.image = null;
    }
    document.getElementById('imagePreviewArea').style.display = 'none';
    uploadZone.style.display = 'block';
    hidePreview();
}

// ============================================
// TEMPLATE SELECTION
// ============================================
function selectTemplate(n) {
    state.selectedTemplate = n;
    document.querySelectorAll('.template-option').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.template) === n);
    });
    if (state.image) renderCover();
}

// ============================================
// TOGGLE SWITCHES
// ============================================
function toggleSwitch(id) {
    const el = document.getElementById(id);
    el.classList.toggle('active');
    if (id === 'togglePrice') state.showPrice = el.classList.contains('active');
    if (id === 'togglePhone') state.showPhone = el.classList.contains('active');
    if (state.image) renderCover();
}

// Input change listeners — auto re-render
['propTitle', 'propSubtitle', 'propSize', 'propPrice', 'propRooms', 'propBath', 'propFloor', 'propType', 'propPhone'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        if (state.image) renderCover();
    });
});

// ============================================
// SHOW / HIDE PREVIEW
// ============================================
function showPreview() {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('previewSection').style.display = 'flex';
}

function hidePreview() {
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('previewSection').style.display = 'none';
}

// ============================================
// RENDER COVER
// ============================================
function renderCover() {
    if (!state.image) return;

    const canvas = document.getElementById('previewCanvas');
    const ctx = canvas.getContext('2d');
    const data = getFormData();

    // Draw base image
    drawImageCover(ctx, state.image.img, canvas.width, canvas.height);

    // Apply selected template
    switch (state.selectedTemplate) {
        case 1: drawCoverTemplate1(ctx, canvas.width, canvas.height, data); break;
        case 2: drawCoverTemplate2(ctx, canvas.width, canvas.height, data, state.image.img); break;
        case 3: drawCoverTemplate3(ctx, canvas.width, canvas.height, data); break;
        case 4: drawCoverTemplate4(ctx, canvas.width, canvas.height, data, state.image.img); break;
        case 5: drawCoverTemplate5(ctx, canvas.width, canvas.height, data, state.image.img); break;
        case 6: drawCoverTemplate6(ctx, canvas.width, canvas.height, data); break;
    }
}

function getFormData() {
    return {
        title: document.getElementById('propTitle').value || '',
        subtitle: document.getElementById('propSubtitle').value || '',
        size: document.getElementById('propSize').value || '',
        price: document.getElementById('propPrice').value || '',
        rooms: document.getElementById('propRooms').value || '',
        bath: document.getElementById('propBath').value || '',
        floor: document.getElementById('propFloor').value || '',
        type: document.getElementById('propType').value || 'PRODAJA',
        phone: document.getElementById('propPhone').value || '',
    };
}

// ============================================
// IMAGE COVER (object-fit: cover equivalent)
// ============================================
function drawImageCover(ctx, img, cw, ch) {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const canvasAspect = cw / ch;
    const imgAspect = iw / ih;

    let sx, sy, sw, sh;
    if (imgAspect > canvasAspect) {
        sh = ih;
        sw = ih * canvasAspect;
        sx = (iw - sw) / 2;
        sy = 0;
    } else {
        sw = iw;
        sh = iw / canvasAspect;
        sx = 0;
        sy = (ih - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

// Scale helper
function s(w, baseVal) {
    return baseVal * (w / 1080);
}

// ============================================
// TEMPLATE 1: Dark Gradient Bottom
// ============================================
function drawCoverTemplate1(ctx, w, h, d) {
    const $ = (v) => s(w, v);

    // Dark gradient from bottom
    const grad = ctx.createLinearGradient(0, h * 0.35, 0, h);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.4, 'rgba(0,0,0,0.3)');
    grad.addColorStop(0.7, 'rgba(0,0,0,0.7)');
    grad.addColorStop(1, 'rgba(0,0,0,0.92)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle top darkening
    const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.2);
    topGrad.addColorStop(0, 'rgba(0,0,0,0.4)');
    topGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, w, h * 0.2);

    // Tag badge (top right)
    const tagText = d.type;
    ctx.font = `800 ${$(16)}px 'Outfit', sans-serif`;
    const tagW = ctx.measureText(tagText).width + $(36);
    const tagH = $(38);
    const tagX = w - tagW - $(50);
    const tagY = $(50);

    ctx.fillStyle = '#B8944A';
    roundRect(ctx, tagX, tagY, tagW, tagH, $(6));
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `800 ${$(16)}px 'Outfit', sans-serif`;
    ctx.letterSpacing = `${$(2)}px`;
    ctx.fillText(tagText, tagX + tagW / 2, tagY + tagH / 2);
    ctx.letterSpacing = '0px';

    // Title
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const titleY = h - $(300);

    if (d.title) {
        ctx.font = `700 ${$(56)}px 'DM Serif Display', serif`;
        ctx.fillStyle = '#ffffff';
        wrapText(ctx, d.title.toUpperCase(), $(60), titleY, w - $(120), $(66));
    }

    // Subtitle (max 50% width, wraps)
    if (d.subtitle) {
        ctx.font = `300 ${$(20)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        wrapText(ctx, d.subtitle, $(60), titleY + $(40), w * 0.5, $(26));
    }

    // Details row
    const detY = h - $(170);
    ctx.font = `700 ${$(38)}px 'Outfit', sans-serif`;
    ctx.fillStyle = '#fff';
    let detX = $(60);

    if (d.size) {
        ctx.fillText(d.size, detX, detY);
        const numW = ctx.measureText(d.size).width;
        ctx.font = `300 ${$(18)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('m²', detX + numW + $(6), detY);
        detX += numW + $(50);
    }

    // Separator dot
    if (d.size && d.rooms) {
        ctx.fillStyle = '#B8944A';
        ctx.beginPath();
        ctx.arc(detX, detY - $(10), $(4), 0, Math.PI * 2);
        ctx.fill();
        detX += $(30);
    }

    if (d.rooms) {
        ctx.font = `700 ${$(38)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.fillText(d.rooms, detX, detY);
        const numW = ctx.measureText(d.rooms).width;
        ctx.font = `300 ${$(18)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('sobe', detX + numW + $(6), detY);
        detX += numW + $(70);
    }

    // Separator dot
    if (d.rooms && d.bath) {
        ctx.fillStyle = '#B8944A';
        ctx.beginPath();
        ctx.arc(detX, detY - $(10), $(4), 0, Math.PI * 2);
        ctx.fill();
        detX += $(30);
    }

    if (d.bath) {
        ctx.font = `700 ${$(38)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.fillText(d.bath, detX, detY);
        const numW = ctx.measureText(d.bath).width;
        ctx.font = `300 ${$(18)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('kup.', detX + numW + $(6), detY);
        detX += numW + $(70);
    }

    // Separator dot
    if (d.bath && d.floor) {
        ctx.fillStyle = '#B8944A';
        ctx.beginPath();
        ctx.arc(detX, detY - $(10), $(4), 0, Math.PI * 2);
        ctx.fill();
        detX += $(30);
    }

    if (d.floor) {
        ctx.font = `700 ${$(38)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.fillText(d.floor, detX, detY);
        const numW = ctx.measureText(d.floor).width;
        ctx.font = `300 ${$(18)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('sprat', detX + numW + $(6), detY);
    }

    // Divider line
    const lineY = h - $(115);
    const lineGrad = ctx.createLinearGradient($(60), 0, w - $(60), 0);
    lineGrad.addColorStop(0, 'rgba(184,148,74,0.5)');
    lineGrad.addColorStop(1, 'rgba(184,148,74,0.05)');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = $(1.5);
    ctx.beginPath();
    ctx.moveTo($(60), lineY);
    ctx.lineTo(w - $(60), lineY);
    ctx.stroke();

    // Price (offset right to avoid logo)
    if (state.showPrice && d.price) {
        ctx.font = `800 ${$(44)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#B8944A';
        ctx.fillText(d.price + ' €', $(120), h - $(65));
    }

    // Phone
    if (state.showPhone && d.phone) {
        ctx.font = `500 ${$(18)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.textAlign = 'right';
        ctx.fillText(d.phone, w - $(60), h - $(70));
        ctx.textAlign = 'left';
    }

    // Logo
    drawLogoOnCanvas(ctx, w, h, $(80), 'bottom-left', $(20));
}

// ============================================
// TEMPLATE 2: Glassmorphism Card
// ============================================
function drawCoverTemplate2(ctx, w, h, d, sourceImg) {
    const $ = (v) => s(w, v);

    // Subtle overall darkening
    const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.3);
    topGrad.addColorStop(0, 'rgba(0,0,0,0.35)');
    topGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, w, h * 0.3);

    // Bottom gradient for card area
    const botGrad = ctx.createLinearGradient(0, h * 0.5, 0, h);
    botGrad.addColorStop(0, 'rgba(0,0,0,0)');
    botGrad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
    botGrad.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, h * 0.5, w, h * 0.5);

    // Tag badge (top right)
    const tagText = d.type;
    ctx.font = `800 ${$(16)}px 'Outfit', sans-serif`;
    const tagW = ctx.measureText(tagText).width + $(36);
    const tagH = $(38);
    ctx.fillStyle = '#B8944A';
    roundRect(ctx, w - tagW - $(40), $(40), tagW, tagH, $(6));
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tagText, w - tagW / 2 - $(40), $(40) + tagH / 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // Logo (top left)
    drawLogoOnCanvas(ctx, w, h, $(70), 'top-left', $(40));

    // Frosted glass card at bottom
    const cardH = $(380);
    const cardY = h - cardH - $(40);
    const cardX = $(40);
    const cardW = w - $(80);

    // Card background (dark glass effect)
    ctx.fillStyle = 'rgba(10, 10, 10, 0.65)';
    roundRect(ctx, cardX, cardY, cardW, cardH, $(16));
    ctx.fill();

    // Card border
    ctx.strokeStyle = 'rgba(184, 148, 74, 0.25)';
    ctx.lineWidth = $(1);
    roundRectPath(ctx, cardX, cardY, cardW, cardH, $(16));
    ctx.stroke();

    // Title inside card
    if (d.title) {
        ctx.font = `700 ${$(48)}px 'DM Serif Display', serif`;
        ctx.fillStyle = '#fff';
        wrapText(ctx, d.title.toUpperCase(), cardX + $(30), cardY + $(60), cardW - $(60), $(56));
    }

    // Subtitle
    if (d.subtitle) {
        ctx.font = `300 ${$(18)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        wrapText(ctx, d.subtitle, cardX + $(30), cardY + $(120), cardW * 0.6, $(24));
    }

    // Gold divider inside card
    const divY = cardY + $(165);
    const lineGrad = ctx.createLinearGradient(cardX + $(30), 0, cardX + cardW - $(30), 0);
    lineGrad.addColorStop(0, 'rgba(184,148,74,0.5)');
    lineGrad.addColorStop(1, 'rgba(184,148,74,0.05)');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = $(1);
    ctx.beginPath();
    ctx.moveTo(cardX + $(30), divY);
    ctx.lineTo(cardX + cardW - $(30), divY);
    ctx.stroke();

    // Detail chips inside card
    const chipY = divY + $(25);
    const items = [];
    if (d.size) items.push(d.size + ' m²');
    if (d.rooms) items.push(d.rooms + ' sobe');
    if (d.bath) items.push(d.bath + ' kup.');
    if (d.floor) items.push(d.floor + ' sprat');

    let chipX = cardX + $(30);
    items.forEach((text) => {
        ctx.font = `500 ${$(16)}px 'Outfit', sans-serif`;
        const tw = ctx.measureText(text).width + $(24);
        ctx.fillStyle = 'rgba(184, 148, 74, 0.12)';
        roundRect(ctx, chipX, chipY, tw, $(34), $(8));
        ctx.fill();
        ctx.strokeStyle = 'rgba(184, 148, 74, 0.25)';
        ctx.lineWidth = $(1);
        roundRectPath(ctx, chipX, chipY, tw, $(34), $(8));
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(text, chipX + tw / 2, chipY + $(22));
        ctx.textAlign = 'left';
        chipX += tw + $(10);
    });

    // Price inside card
    if (state.showPrice && d.price) {
        ctx.font = `800 ${$(42)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#B8944A';
        ctx.fillText(d.price + ' €', cardX + $(30), cardY + cardH - $(50));
    }

    // Phone inside card
    if (state.showPhone && d.phone) {
        ctx.font = `400 ${$(15)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.textAlign = 'right';
        ctx.fillText(d.phone, cardX + cardW - $(30), cardY + cardH - $(55));
        ctx.textAlign = 'left';
    }
}

// ============================================
// TEMPLATE 3: Cinematic Bars
// ============================================
function drawCoverTemplate3(ctx, w, h, d) {
    const $ = (v) => s(w, v);
    const barH = $(180);

    // Top dark bar
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, barH);

    // Bottom dark bar
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, h - barH, w, barH);

    // Subtle vignette on image area
    const vigGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.8);
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, barH, w, h - barH * 2);

    // Gold accent lines
    ctx.fillStyle = '#B8944A';
    ctx.fillRect(0, barH, w, $(3));
    ctx.fillRect(0, h - barH - $(3), w, $(3));

    // Logo on top bar (left)
    if (state.logoImg) {
        const logoS = $(90);
        ctx.drawImage(state.logoImg, $(40), (barH - logoS) / 2, logoS, logoS);
    }

    // Type tag on top bar (right)
    const tagText = d.type;
    ctx.font = `800 ${$(18)}px 'Outfit', sans-serif`;
    ctx.fillStyle = '#B8944A';
    ctx.textAlign = 'right';
    ctx.letterSpacing = `${$(3)}px`;
    ctx.fillText(tagText, w - $(50), barH / 2 + $(6));
    ctx.letterSpacing = '0px';
    ctx.textAlign = 'left';

    // Title on bottom bar
    if (d.title) {
        ctx.font = `700 ${$(42)}px 'DM Serif Display', serif`;
        ctx.fillStyle = '#ffffff';
        wrapText(ctx, d.title.toUpperCase(), $(50), h - barH + $(55), w * 0.6, $(50));
    }

    // Subtitle below title
    if (d.subtitle) {
        ctx.font = `300 ${$(16)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        wrapText(ctx, d.subtitle, $(50), h - barH + $(105), w * 0.5, $(22));
    }

    // Details on bottom bar (right side)
    let detStr = '';
    if (d.size) detStr += d.size + ' m²';
    if (d.rooms) detStr += '  ·  ' + d.rooms + ' sobe';
    if (d.floor) detStr += '  ·  ' + d.floor + ' sprat';

    ctx.font = `400 ${$(16)}px 'Outfit', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.textAlign = 'right';
    ctx.fillText(detStr, w - $(50), h - barH + $(55));
    ctx.textAlign = 'left';

    // Price on bottom bar
    if (state.showPrice && d.price) {
        ctx.font = `800 ${$(40)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#B8944A';
        ctx.textAlign = 'right';
        ctx.fillText(d.price + ' €', w - $(50), h - $(45));
        ctx.textAlign = 'left';
    }

    // Phone on bottom bar
    if (state.showPhone && d.phone) {
        ctx.font = `400 ${$(14)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.textAlign = 'right';
        ctx.fillText(d.phone, w - $(50), h - $(100));
        ctx.textAlign = 'left';
    }
}

// ============================================
// TEMPLATE 4: Bold Tag
// ============================================
function drawCoverTemplate4(ctx, w, h, d, sourceImg) {
    const $ = (v) => s(w, v);
    const barH = $(220);

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // Image below diagonal
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, barH);
    ctx.lineTo(w, barH - $(60));
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.clip();
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h - barH + $(60);
    const tempCtx = tempCanvas.getContext('2d');
    drawImageCover(tempCtx, sourceImg, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(tempCanvas, 0, barH - $(60));
    ctx.restore();

    // Gold bar
    ctx.fillStyle = '#B8944A';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, barH - $(60));
    ctx.lineTo(0, barH);
    ctx.closePath();
    ctx.fill();

    // Type text on bar
    ctx.font = `900 ${$(60)}px 'Outfit', sans-serif`;
    ctx.fillStyle = '#0a0a0a';
    ctx.textAlign = 'left';
    ctx.fillText(d.type, $(60), $(120));

    // Title on bar (wraps within gold bar)
    if (d.title) {
        ctx.font = `400 ${$(22)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        wrapText(ctx, d.title, $(60), $(165), w * 0.5, $(28));
    }

    // Logo on gold bar (right, subtle)
    if (state.logoImg) {
        const logoS = $(130);
        ctx.globalAlpha = 0.2;
        ctx.drawImage(state.logoImg, w - logoS - $(40), $(30), logoS, logoS);
        ctx.globalAlpha = 1;
    }

    // Bottom overlay
    const botGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
    botGrad.addColorStop(0, 'rgba(0,0,0,0)');
    botGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, h * 0.5, w, h * 0.5);

    // Details
    const detY = h - $(150);
    let detailStr = '';
    if (d.size) detailStr += d.size + ' m²';
    if (d.rooms) detailStr += '  |  ' + d.rooms + ' sobe';
    if (d.floor) detailStr += '  |  ' + d.floor + ' sprat';

    ctx.font = `500 ${$(22)}px 'Outfit', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.textAlign = 'left';
    ctx.fillText(detailStr, $(60), detY);

    if (state.showPrice && d.price) {
        ctx.font = `800 ${$(48)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#B8944A';
        ctx.fillText(d.price + ' €', $(60), h - $(70));
    }

    if (state.showPhone && d.phone) {
        ctx.font = `400 ${$(16)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.textAlign = 'right';
        ctx.fillText(d.phone, w - $(60), h - $(75));
        ctx.textAlign = 'left';
    }

    drawLogoOnCanvas(ctx, w, h, $(70), 'bottom-left', $(12));
}

// ============================================
// TEMPLATE 5: Light Clean
// ============================================
function drawCoverTemplate5(ctx, w, h, d, sourceImg) {
    const $ = (v) => s(w, v);

    // White background
    ctx.fillStyle = '#f5f3ef';
    ctx.fillRect(0, 0, w, h);

    // Image area with padding
    const imgPad = $(40);
    const imgH = h * 0.55;
    const imgRadius = $(16);

    ctx.save();
    roundRectPath(ctx, imgPad, imgPad, w - imgPad * 2, imgH, imgRadius);
    ctx.clip();
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w - imgPad * 2;
    tempCanvas.height = imgH;
    const tempCtx = tempCanvas.getContext('2d');
    drawImageCover(tempCtx, sourceImg, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(tempCanvas, imgPad, imgPad);
    ctx.restore();

    // Tag on image
    const tagText = d.type;
    ctx.font = `700 ${$(14)}px 'Outfit', sans-serif`;
    const tW = ctx.measureText(tagText).width + $(28);
    const tH = $(34);
    ctx.fillStyle = '#B8944A';
    roundRect(ctx, w - imgPad - tW - $(15), imgPad + $(15), tW, tH, $(6));
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tagText, w - imgPad - tW / 2 - $(15), imgPad + $(15) + tH / 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // Content below image
    const contentY = imgPad + imgH + $(50);

    // Title
    if (d.title) {
        ctx.font = `700 ${$(52)}px 'DM Serif Display', serif`;
        ctx.fillStyle = '#1a1a1a';
        wrapText(ctx, d.title.toUpperCase(), $(55), contentY, w - $(110), $(62));
    }

    // Subtitle (max 50% width, wraps)
    if (d.subtitle) {
        ctx.font = `300 ${$(18)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#888';
        wrapText(ctx, d.subtitle, $(55), contentY + $(50), w * 0.5, $(24));
    }

    // Detail boxes
    const boxY = contentY + $(100);
    const boxW = (w - $(110) - $(30)) / 3;
    const boxH = $(90);
    const boxes = [];
    if (d.size) boxes.push({ val: d.size, label: 'm²' });
    if (d.rooms) boxes.push({ val: d.rooms, label: 'Sobe' });
    if (d.bath) boxes.push({ val: d.bath, label: 'Kupatila' });

    boxes.forEach((box, i) => {
        const bx = $(55) + i * (boxW + $(15));
        ctx.fillStyle = '#e8e4dd';
        roundRect(ctx, bx, boxY, boxW, boxH, $(10));
        ctx.fill();

        ctx.font = `700 ${$(34)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#1a1a1a';
        ctx.textAlign = 'center';
        ctx.fillText(box.val, bx + boxW / 2, boxY + $(38));

        ctx.font = `400 ${$(14)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#999';
        ctx.fillText(box.label, bx + boxW / 2, boxY + $(65));
        ctx.textAlign = 'left';
    });

    // Gold divider
    ctx.strokeStyle = '#B8944A';
    ctx.lineWidth = $(2);
    ctx.beginPath();
    ctx.moveTo($(55), boxY + boxH + $(35));
    ctx.lineTo(w - $(55), boxY + boxH + $(35));
    ctx.stroke();

    // Price
    if (state.showPrice && d.price) {
        ctx.font = `800 ${$(46)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#B8944A';
        ctx.fillText(d.price + ' €', $(55), boxY + boxH + $(95));
    }

    // Phone
    if (state.showPhone && d.phone) {
        ctx.font = `400 ${$(16)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#999';
        ctx.textAlign = 'right';
        ctx.fillText(d.phone, w - $(55), boxY + boxH + $(90));
        ctx.textAlign = 'left';
    }

    // Logo bottom center
    if (state.logoImg) {
        const logoS = $(90);
        ctx.globalAlpha = 0.15;
        ctx.drawImage(state.logoImg, (w - logoS) / 2, h - logoS - $(30), logoS, logoS);
        ctx.globalAlpha = 1;
    }
}

// ============================================
// TEMPLATE 6: Magazine Style
// ============================================
function drawCoverTemplate6(ctx, w, h, d) {
    const $ = (v) => s(w, v);

    // Dark overlay
    const overlayGrad = ctx.createLinearGradient(0, 0, 0, h);
    overlayGrad.addColorStop(0, 'rgba(0,0,0,0.1)');
    overlayGrad.addColorStop(0.6, 'rgba(0,0,0,0.3)');
    overlayGrad.addColorStop(0.85, 'rgba(0,0,0,0.6)');
    overlayGrad.addColorStop(1, 'rgba(0,0,0,0.0)');
    ctx.fillStyle = overlayGrad;
    ctx.fillRect(0, 0, w, h);

    // Gold bottom strip
    const stripH = $(130);
    ctx.fillStyle = '#B8944A';
    ctx.fillRect(0, h - stripH, w, stripH);

    // Logo on strip
    if (state.logoImg) {
        const logoS = $(80);
        ctx.globalAlpha = 0.25;
        ctx.drawImage(state.logoImg, w - logoS - $(30), h - stripH + (stripH - logoS) / 2, logoS, logoS);
        ctx.globalAlpha = 1;
    }

    // Title
    if (d.title) {
        ctx.font = `800 ${$(64)}px 'DM Serif Display', serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        wrapText(ctx, d.title.toUpperCase(), $(60), h - stripH - $(200), w - $(120), $(74));
    }

    // Tag
    ctx.font = `600 ${$(16)}px 'Outfit', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.letterSpacing = `${$(4)}px`;
    ctx.fillText(d.type, $(60), h - stripH - $(110));
    ctx.letterSpacing = '0px';

    // Details
    let detStr = '';
    if (d.size) detStr += d.size + ' m²';
    if (d.rooms) detStr += '  ·  ' + d.rooms + ' sobe';
    if (d.floor) detStr += '  ·  ' + d.floor + ' sprat';

    ctx.font = `400 ${$(18)}px 'Outfit', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(detStr, $(60), h - stripH - $(70));

    // Price on gold strip
    if (state.showPrice && d.price) {
        ctx.font = `900 ${$(48)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#0a0a0a';
        ctx.fillText(d.price + ' €', $(50), h - $(45));
    }

    // Phone on strip
    if (state.showPhone && d.phone) {
        ctx.font = `400 ${$(16)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillText(d.phone, $(50), h - $(90));
    }

    // Vertical text accent
    ctx.save();
    ctx.translate(w - $(30), h * 0.4);
    ctx.rotate(-Math.PI / 2);
    ctx.font = `300 ${$(12)}px 'Outfit', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.letterSpacing = `${$(4)}px`;
    ctx.textAlign = 'center';
    ctx.fillText('APEX REAL ESTATE', 0, 0);
    ctx.restore();
    ctx.textAlign = 'left';
    ctx.letterSpacing = '0px';
}

// ============================================
// LOGO DRAWING
// ============================================
function drawLogoOnCanvas(ctx, w, h, size, position, margin) {
    if (!state.logoImg) return;

    let x, y;
    switch (position) {
        case 'top-left': x = margin; y = margin; break;
        case 'top-right': x = w - size - margin; y = margin; break;
        case 'bottom-left': x = margin; y = h - size - margin; break;
        case 'bottom-right': x = w - size - margin; y = h - size - margin; break;
    }

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = size * 0.3;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = size * 0.05;
    ctx.drawImage(state.logoImg, x, y, size, size);
    ctx.restore();
}

// ============================================
// HELPERS
// ============================================
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    maxLines = maxLines || 3;
    const words = text.split(' ');
    let line = '';
    let lineY = y;
    let lineCount = 0;

    for (let i = 0; i < words.length; i++) {
        let word = words[i];

        // Handle words longer than maxWidth — break by character
        if (ctx.measureText(word).width > maxWidth && line === '') {
            let partial = '';
            for (let c = 0; c < word.length; c++) {
                const test = partial + word[c];
                if (ctx.measureText(test).width > maxWidth && partial.length > 0) {
                    if (lineCount >= maxLines - 1) {
                        ctx.fillText(partial.trim() + '…', x, lineY);
                        return;
                    }
                    ctx.fillText(partial, x, lineY);
                    lineY += lineHeight;
                    lineCount++;
                    partial = word[c];
                } else {
                    partial = test;
                }
            }
            line = partial + ' ';
            continue;
        }

        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > maxWidth && line !== '') {
            if (lineCount >= maxLines - 1) {
                ctx.fillText(line.trim() + '…', x, lineY);
                return;
            }
            ctx.fillText(line.trim(), x, lineY);
            line = word + ' ';
            lineY += lineHeight;
            lineCount++;
        } else {
            line = testLine;
        }
    }
    if (line.trim()) {
        ctx.fillText(line.trim(), x, lineY);
    }
}

// ============================================
// DOWNLOAD
// ============================================
function downloadCover() {
    if (!state.image) {
        showToast('Prvo dodaj fotografiju nekretnine');
        return;
    }

    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = 1080;
    fullCanvas.height = 1350;
    const fullCtx = fullCanvas.getContext('2d');

    // Draw base image
    drawImageCover(fullCtx, state.image.img, fullCanvas.width, fullCanvas.height);

    // Apply template
    const data = getFormData();
    switch (state.selectedTemplate) {
        case 1: drawCoverTemplate1(fullCtx, 1080, 1350, data); break;
        case 2: drawCoverTemplate2(fullCtx, 1080, 1350, data, state.image.img); break;
        case 3: drawCoverTemplate3(fullCtx, 1080, 1350, data); break;
        case 4: drawCoverTemplate4(fullCtx, 1080, 1350, data, state.image.img); break;
        case 5: drawCoverTemplate5(fullCtx, 1080, 1350, data, state.image.img); break;
        case 6: drawCoverTemplate6(fullCtx, 1080, 1350, data); break;
    }

    // Prompt for filename (Save As)
    const defaultName = 'APEX_' + (document.getElementById('propTitle').value || 'cover').replace(/[^a-zA-Z0-9čćžšđČĆŽŠĐ ]/g, '').replace(/ +/g, '_');
    const fileName = prompt('Ime fajla za čuvanje:', defaultName);
    if (!fileName) return; // User cancelled

    fullCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.endsWith('.png') ? fileName : fileName + '.png';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Cover sačuvan kao: ' + a.download + ' ✓');
    }, 'image/png');
}

async function copyToClipboard() {
    if (!state.image) {
        showToast('Prvo dodaj fotografiju nekretnine');
        return;
    }

    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = 1080;
    fullCanvas.height = 1350;
    const fullCtx = fullCanvas.getContext('2d');

    drawImageCover(fullCtx, state.image.img, fullCanvas.width, fullCanvas.height);

    const data = getFormData();
    switch (state.selectedTemplate) {
        case 1: drawCoverTemplate1(fullCtx, 1080, 1350, data); break;
        case 2: drawCoverTemplate2(fullCtx, 1080, 1350, data, state.image.img); break;
        case 3: drawCoverTemplate3(fullCtx, 1080, 1350, data); break;
        case 4: drawCoverTemplate4(fullCtx, 1080, 1350, data, state.image.img); break;
        case 5: drawCoverTemplate5(fullCtx, 1080, 1350, data, state.image.img); break;
        case 6: drawCoverTemplate6(fullCtx, 1080, 1350, data); break;
    }

    try {
        const blob = await new Promise(resolve => fullCanvas.toBlob(resolve, 'image/png'));
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('Kopirano u clipboard! ✓');
    } catch (err) {
        showToast('Kopiranje nije uspelo — preuzmi PNG');
    }
}

// ============================================
// RESET
// ============================================
function resetForm() {
    removeImage();
    document.getElementById('propTitle').value = '';
    document.getElementById('propSubtitle').value = '';
    document.getElementById('propSize').value = '';
    document.getElementById('propPrice').value = '';
    document.getElementById('propRooms').value = '';
    document.getElementById('propBath').value = '';
    document.getElementById('propFloor').value = '';
    document.getElementById('propType').value = 'PRODAJA';
    // Keep phone as default
    selectTemplate(1);
    state.showPrice = true;
    state.showPhone = true;
    document.getElementById('togglePrice').classList.add('active');
    document.getElementById('togglePhone').classList.add('active');
    showToast('Forma resetovana');
}

// ============================================
// TOAST
// ============================================
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    sessionStorage.removeItem('apex_auth');
    sessionStorage.removeItem('apex_user');
    window.location.href = 'login.html';
}
