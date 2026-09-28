// Initialize saved settings & data on page load
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initUser();
    initTheme();
    renderCustomLinks();
});

/* ----------------------------------------------------
   1. LIVE CLOCK & DATE FUNCTIONALITY
---------------------------------------------------- */
function initClock() {
    function updateClock() {
        const now = new Date();
        
        // Format time (HH:MM:SS)
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        
        const clockElem = document.getElementById('clock');
        if (clockElem) clockElem.innerText = timeString;

        // Format date (e.g., "Domingo, 27 de Setembro")
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const dateString = now.toLocaleDateString('pt-BR', options);
        const capitalizedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        
        const dateElem = document.getElementById('date');
        if (dateElem) dateElem.innerText = capitalizedDate;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* ----------------------------------------------------
   2. USERNAME MANAGEMENT (localStorage)
---------------------------------------------------- */
function initUser() {
    let savedName = localStorage.getItem('navigator_username');
    
    if (!savedName) {
        savedName = prompt('Escreva o seu nome:', 'Usuário');
        if (!savedName || savedName.trim() === '') {
            savedName = 'User';
        }
        localStorage.setItem('navigator_username', savedName);
    }
    
    updateUsernameUI(savedName);
}

function updateUsernameUI(name) {
    const usernameElem = document.getElementById('Username');
    if (usernameElem) {
        usernameElem.innerText = `${name}!`;
    }
}

function changeUsername() {
    const input = document.getElementById('newUsernameInput');
    if (input && input.value.trim() !== '') {
        const newName = input.value.trim();
        localStorage.setItem('navigator_username', newName);
        updateUsernameUI(newName);
        input.value = '';
        alert(`Nome alterado com sucesso para ${newName}!`);
    } else {
        alert('Por favor, digite um nome válido.');
    }
}

/* ----------------------------------------------------
   3. SEARCH BAR FUNCTIONALITY
---------------------------------------------------- */
function performSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    const engine = document.getElementById('search-engine').value;

    if (!query) return;

    // Check if input is a direct URL
    if (query.startsWith('http://') || query.startsWith('https://')) {
        window.open(query, '_blank');
        return;
    } else if (query.includes('.') && !query.includes(' ')) {
        window.open(`https://${query}`, '_blank');
        return;
    }

    let searchUrl = '';
    switch (engine) {
        case 'youtube':
            searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
            break;
        case 'bing':
            searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
            break;
        case 'duckduckgo':
            searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
            break;
        case 'google':
        default:
            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            break;
    }

    window.open(searchUrl, '_blank');
}

/* ----------------------------------------------------
   4. THEME / BACKGROUND MANAGEMENT
---------------------------------------------------- */
function setTheme(theme) {
    const paragraph = document.getElementById('paragraph');
    
    if (theme === 'black') {
        document.body.style.backgroundColor = '#000000';
        document.body.style.backgroundImage = 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)';
        if (paragraph) paragraph.innerText = 'Modo Preto Puro Neon Ativo.';
    } else if (theme === 'cyber') {
        document.body.style.backgroundColor = '#030b1e';
        document.body.style.backgroundImage = 'radial-gradient(circle at 50% 0%, rgba(0, 210, 255, 0.15) 0%, transparent 70%)';
        if (paragraph) paragraph.innerText = 'Modo Cyber Dark Blue Ativo.';
    } else if (theme === 'deep-purple') {
        document.body.style.backgroundColor = '#120024';
        document.body.style.backgroundImage = 'radial-gradient(circle at 50% 0%, rgba(180, 0, 255, 0.15) 0%, transparent 70%)';
        if (paragraph) paragraph.innerText = 'Modo Roxo Noturno Ativo.';
    }
    
    localStorage.setItem('navigator_theme', theme);
}

function darkMode() {
    setTheme('black');
}

function initTheme() {
    const savedTheme = localStorage.getItem('navigator_theme') || 'black';
    setTheme(savedTheme);
}

/* ----------------------------------------------------
   5. DYNAMIC CUSTOM LINKS ADDITION & MANAGEMENT
---------------------------------------------------- */
function getCustomLinks() {
    const links = localStorage.getItem('navigator_custom_links');
    return links ? JSON.parse(links) : [];
}

function saveCustomLinks(links) {
    localStorage.setItem('navigator_custom_links', JSON.stringify(links));
}

function addCustomLink(event) {
    event.preventDefault();
    const titleInput = document.getElementById('linkTitle');
    const urlInput = document.getElementById('linkUrl');
    const colorSelect = document.getElementById('linkColor');

    const title = titleInput.value.trim();
    let url = urlInput.value.trim();
    const background = colorSelect.value;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    const newLink = {
        id: Date.now(),
        title: title,
        url: url,
        background: background
    };

    const links = getCustomLinks();
    links.push(newLink);
    saveCustomLinks(links);

    renderCustomLinks();

    // Reset Form
    titleInput.value = '';
    urlInput.value = '';
    alert(`Link "${title}" adicionado com sucesso!`);
}

function deleteCustomLink(id) {
    let links = getCustomLinks();
    links = links.filter(link => link.id !== id);
    saveCustomLinks(links);
    renderCustomLinks();
}

function clearCustomLinks() {
    if (confirm('Tem certeza que deseja apagar todos os links personalizados criados?')) {
        localStorage.removeItem('navigator_custom_links');
        renderCustomLinks();
    }
}

function renderCustomLinks() {
    const container = document.getElementById('customLinksContainer');
    const section = document.getElementById('custom-links-section');
    if (!container) return;

    const links = getCustomLinks();
    container.innerHTML = '';

    if (links.length === 0) {
        if (section) section.style.display = 'none';
        return;
    } else {
        if (section) section.style.display = 'block';
    }

    links.forEach(link => {
        const card = document.createElement('div');
        card.className = 'links neon-white-card';
        card.style.background = link.background;

        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.className = 'link-acess';
        anchor.innerText = link.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-link-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.title = 'Excluir link';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteCustomLink(link.id);
        };

        card.appendChild(deleteBtn);
        card.appendChild(anchor);
        container.appendChild(card);
    });
}
