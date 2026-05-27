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

    // Subtitle
    if (d.subtitle) {
        ctx.font = `300 ${$(22)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText(d.subtitle, $(60), titleY + $(40));
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

    // Price
    if (state.showPrice && d.price) {
        ctx.font = `800 ${$(44)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#B8944A';
        ctx.fillText(d.price, $(60), h - $(65));
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
// TEMPLATE 2: Side Panel
// ============================================
function drawCoverTemplate2(ctx, w, h, d, sourceImg) {
    const $ = (v) => s(w, v);
    const panelW = w * 0.38;

    // Clear and draw image on right side only
    ctx.save();
    ctx.beginPath();
    ctx.rect(panelW, 0, w - panelW, h);
    ctx.clip();
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = Math.round(w - panelW);
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext('2d');
    drawImageCover(tempCtx, sourceImg, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(tempCanvas, panelW, 0);
    ctx.restore();

    // Left panel
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, panelW, h);

    // Gold accent line
    ctx.fillStyle = '#B8944A';
    ctx.fillRect(panelW - $(3), 0, $(3), h);

    // Logo
    if (state.logoImg) {
        const logoS = $(140);
        const lx = (panelW - logoS) / 2;
        ctx.drawImage(state.logoImg, lx, $(80), logoS, logoS);
    }

    // Tag
    ctx.font = `700 ${$(14)}px 'Outfit', sans-serif`;
    ctx.fillStyle = '#B8944A';
    ctx.textAlign = 'center';
    ctx.letterSpacing = `${$(3)}px`;
    ctx.fillText(d.type, panelW / 2, $(280));
    ctx.letterSpacing = '0px';

    // Title
    if (d.title) {
        ctx.font = `700 ${$(40)}px 'DM Serif Display', serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        wrapText(ctx, d.title, $(35), $(400), panelW - $(70), $(50));
    }

    // Details
    const baseY = $(600);
    const items = [];
    if (d.size) items.push({ val: d.size, label: 'm²' });
    if (d.rooms) items.push({ val: d.rooms, label: 'Sobe' });
    if (d.bath) items.push({ val: d.bath, label: 'Kup.' });
    if (d.floor) items.push({ val: d.floor, label: 'Sprat' });

    items.forEach((item, i) => {
        const iy = baseY + i * $(90);
        ctx.font = `700 ${$(34)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.fillText(item.val, $(35), iy);
        ctx.font = `300 ${$(14)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText(item.label, $(35), iy + $(24));
    });

    // Price at bottom
    if (state.showPrice && d.price) {
        ctx.font = `800 ${$(36)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#B8944A';
        ctx.textAlign = 'center';
        ctx.fillText(d.price, panelW / 2, h - $(120));
    }

    // Phone
    if (state.showPhone && d.phone) {
        ctx.font = `400 ${$(14)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.textAlign = 'center';
        ctx.fillText(d.phone, panelW / 2, h - $(70));
    }

    ctx.textAlign = 'left';
}

// ============================================
// TEMPLATE 3: Elegant Frame
// ============================================
function drawCoverTemplate3(ctx, w, h, d) {
    const $ = (v) => s(w, v);

    // Overall darkening
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, w, h);

    // Gold frame
    const frameInset = $(30);
    ctx.strokeStyle = 'rgba(184,148,74,0.5)';
    ctx.lineWidth = $(2);
    ctx.strokeRect(frameInset, frameInset, w - frameInset * 2, h - frameInset * 2);

    // Inner frame
    const innerInset = $(40);
    ctx.strokeStyle = 'rgba(184,148,74,0.15)';
    ctx.lineWidth = $(1);
    ctx.strokeRect(innerInset, innerInset, w - innerInset * 2, h - innerInset * 2);

    // Logo top left
    if (state.logoImg) {
        const logoS = $(100);
        ctx.drawImage(state.logoImg, $(60), $(50), logoS, logoS);
    }

    // Tag top right
    ctx.font = `800 ${$(15)}px 'Outfit', sans-serif`;
    ctx.fillStyle = '#B8944A';
    ctx.textAlign = 'right';
    ctx.letterSpacing = `${$(3)}px`;
    ctx.fillText(d.type, w - $(60), $(95));
    ctx.letterSpacing = '0px';

    // Bottom dark area
    const bottomH = $(350);
    const bottomGrad = ctx.createLinearGradient(0, h - bottomH - $(100), 0, h);
    bottomGrad.addColorStop(0, 'rgba(0,0,0,0)');
    bottomGrad.addColorStop(0.3, 'rgba(0,0,0,0.5)');
    bottomGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, h - bottomH - $(100), w, bottomH + $(100));

    // Title
    ctx.textAlign = 'left';
    if (d.title) {
        ctx.font = `700 ${$(52)}px 'DM Serif Display', serif`;
        ctx.fillStyle = '#ffffff';
        wrapText(ctx, d.title.toUpperCase(), $(60), h - $(280), w - $(120), $(62));
    }

    // Subtitle
    if (d.subtitle) {
        ctx.font = `300 ${$(20)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText(d.subtitle, $(60), h - $(200));
    }

    // Details line
    let detailStr = '';
    if (d.size) detailStr += d.size + ' m²';
    if (d.rooms) detailStr += '  •  ' + d.rooms + ' sobe';
    if (d.bath) detailStr += '  •  ' + d.bath + ' kup.';
    if (d.floor) detailStr += '  •  ' + d.floor + ' sprat';

    ctx.font = `400 ${$(18)}px 'Outfit', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(detailStr, $(60), h - $(150));

    // Gold line
    ctx.strokeStyle = 'rgba(184,148,74,0.4)';
    ctx.lineWidth = $(1.5);
    ctx.beginPath();
    ctx.moveTo($(60), h - $(120));
    ctx.lineTo(w - $(60), h - $(120));
    ctx.stroke();

    // Price + Phone
    if (state.showPrice && d.price) {
        ctx.font = `800 ${$(40)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#B8944A';
        ctx.fillText(d.price, $(60), h - $(70));
    }

    if (state.showPhone && d.phone) {
        ctx.font = `400 ${$(16)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.textAlign = 'right';
        ctx.fillText(d.phone, w - $(60), h - $(75));
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

    // Title on bar
    if (d.title) {
        ctx.font = `400 ${$(24)}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillText(d.title, $(60), $(170));
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
        ctx.fillText(d.price, $(60), h - $(70));
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

    // Subtitle
    if (d.subtitle) {
        ctx.font = `300 ${$(20)}px 'Outfit', sans-serif`;
        ctx.fillStyle = '#888';
        ctx.fillText(d.subtitle, $(55), contentY + $(50));
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
        ctx.fillText(d.price, $(55), boxY + boxH + $(95));
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
        ctx.fillText(d.price, $(50), h - $(45));
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

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lineY = y;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line.trim(), x, lineY);
            line = words[i] + ' ';
            lineY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line.trim(), x, lineY);
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

    fullCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const title = document.getElementById('propTitle').value.replace(/[^a-zA-Z0-9]/g, '_') || 'cover';
        a.href = url;
        a.download = `apex_cover_${title}.png`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Cover preuzet! ✓');
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
