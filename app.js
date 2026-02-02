const API_URL = '/api/api.php';
const gameForm = document.getElementById('game-form');
let allGames = [];
let currentPage = 1;
const pageSize = 10;

// READ: Fetch all data from your live PHP API
async function loadGames() {
    try {
        const response = await fetch(API_URL);
        allGames = await response.json();
        renderTable();
        updateStats();
    } catch (error) {
        console.error("Error loading games:", error);
    }
}

// RENDER: Displays only 10 games per page (Paging Requirement)
function renderTable() {
    const tbody = document.getElementById('game-list-body');
    tbody.innerHTML = '';

    const start = (currentPage - 1) * pageSize;
    const pagedGames = allGames.slice(start, start + pageSize);

    pagedGames.forEach(game => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${game.title}</td>
            <td>${game.platform}</td>
            <td>${game.hoursPlayed}</td>
            <td>${game.status}</td>
            <td>
                <button onclick="editGame(${game.id})">Edit</button>
                <button onclick="deleteGame(${game.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('page-info').innerText = `Page ${currentPage}`;
}

// Paging Controls
function nextPage() {
    if (currentPage * pageSize < allGames.length) {
        currentPage++;
        renderTable();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

// Stats Calculation
function updateStats() {
    const totalCount = allGames.length;
    const totalHours = allGames.reduce((sum, g) => sum + Number(g.hoursPlayed), 0);
    const avgHours = totalCount > 0 ? (totalHours / totalCount).toFixed(1) : 0;

    document.getElementById('stat-total-count').innerText = totalCount;
    document.getElementById('stat-total-hours').innerText = totalHours;
    document.getElementById('stat-avg-hours').innerText = avgHours;
}

// CREATE & UPDATE: Send data to the PHP server
gameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('game-id').value;
    const gameData = {
        title: document.getElementById('title').value,
        platform: document.getElementById('platform').value,
        hoursPlayed: document.getElementById('hours').value,
        status: document.getElementById('status').value
    };

    if (id) {
        gameData.id = id;
        await fetch(API_URL, { method: 'PUT', body: JSON.stringify(gameData) });
    } else {
        await fetch(API_URL, { method: 'POST', body: JSON.stringify(gameData) });
    }

    gameForm.reset();
    document.getElementById('game-id').value = '';
    showView('list-view');
    loadGames();
});

// DELETE: Remove data via PHP API
async function deleteGame(id) {
    if (confirm("Are you sure you want to remove this game?")) {
        await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
        loadGames();
    }
}

function editGame(id) {
    const game = allGames.find(g => g.id == id);
    document.getElementById('game-id').value = game.id;
    document.getElementById('title').value = game.title;
    document.getElementById('platform').value = game.platform;
    document.getElementById('hours').value = game.hoursPlayed;
    document.getElementById('status').value = game.status;
    document.getElementById('form-title').innerText = "Edit Game";
    showView('form-view');
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
}

window.onload = loadGames;