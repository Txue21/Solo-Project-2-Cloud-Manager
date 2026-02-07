# GameVault

- **Frontend:** https://app.netlify.com/projects/gamevault-cloud/overview
- **Backend API:** https://tian-game-vault.com/api.php

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** PHP
- **Data Storage:** JSON
- **Hosting:** Netlify (frontend) + Hostinger (backend API)

## JSON Persistence
1. **Storage:** All game data is saved in a `games.json` file on the Hostinger server
2. **Reading Data:** When the page loads, PHP reads the JSON file using `file_get_contents()` and sends it to the frontend
3. **Writing Data:** When creating/updating/deleting games, PHP writes changes back to the JSON file using `file_put_contents()`
4. **Persistence:** The JSON file stays on the server permanently, so data isn't lost when we close the browser or restart the server
5. **Why JSON?** It's simple

## Loom Link
https://www.loom.com/share/d080771294be460fb31a50e9568d5762
