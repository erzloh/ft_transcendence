import { BASE_URL } from '../index.js';
import { updateTextForElem } from '../utils/languages.js';

// Function that will be called when the view is loaded
export function pongStatistics () {
	// Select elements
	const pvpBtn = document.getElementById('pvp-stat-btn');
	const aiBtn = document.getElementById('ai-stat-btn');
	const tournamentBtn = document.getElementById('tournament-stat-btn');

	const statTable = document.getElementById('pong-stat-table');
	const globalStatTable = document.getElementById('pong-global-stat-table');

	// Fill global stats table
	const fillGlobalStatTable = () => {
		globalStatTable.innerHTML = '';

		// Create the table headers
		const thead = document.createElement('thead');
		const tr = document.createElement('tr');
		const columns = ['total games', 'total duration', 'average duration'];
		columns.forEach(column => {
			const th = document.createElement('th');
			th.setAttribute('data-translate', column);
			tr.appendChild(th);
			updateTextForElem(th, column);
		})
		thead.appendChild(tr);
		globalStatTable.append(thead);

		// Create the table body
		const tbody = document.createElement('tbody');
		globalStatTable.appendChild(tbody);

		// Get the global stats
		const fillGlobalStats = async () => {
			const response = await fetch(`${BASE_URL}/api/pong_stats/`);
			if (response.status === 200) {
				const responseData = await response.json();
				
				const tr = document.createElement('tr');
				const columns = ['total_pong_matches', 'total_pong_time', 'average_pong_time'];
				columns.forEach(column => {
					const td = document.createElement('td');
					td.textContent = responseData[column];
					tr.appendChild(td);
				});
				tbody.appendChild(tr);
			}
		}

		fillGlobalStats();
	}

	// Fill table with pvp stats
	// Function to fill the table
	const fillPvpTable = () => {
		// Clear the table
		statTable.innerHTML = '';

		// Create the table headers
		const thead = document.createElement('thead');
		const tr = document.createElement('tr');
		const columns = ['db date', 'db player 1', 'db player 2', 'db score', 'db winner', 'db duration'];
		columns.forEach(column => {
			const th = document.createElement('th');
			th.setAttribute('data-translate', column);
			tr.appendChild(th);
			updateTextForElem(th, column);
		});
		thead.appendChild(tr);
		statTable.appendChild(thead);

		// Create the table body
		const tbody = document.createElement('tbody');
		statTable.appendChild(tbody);

		// Get the pvp stats and add them to the table
		const fillPvpStats = async () => {
			console.log('Fetching pvp stats');
			const response = await fetch(`${BASE_URL}/api/PvPong_match_history/`);
			console.log(response);
			if (response.status === 200) {
				const stats = await response.json();
				console.log(stats);

				// If there are no stats
				if (stats.length === 0) {
					const tr = document.createElement('tr');
					const td = document.createElement('td');
					td.setAttribute('colspan', '6');
					td.setAttribute('data-translate', 'no stats');
					updateTextForElem(td, 'no stats');
					tr.appendChild(td);
					tbody.appendChild(tr);
					return;
				}

				// Add the stats to the table
				stats.map(stat => {
					const tr = document.createElement('tr');
					const columns = ['match_date', 'player_one', 'player_two', 'match_score', 'winner', 'match_duration'];
					columns.forEach(column => {
						const td = document.createElement('td');
						td.textContent = stat[column];
						tr.appendChild(td);
					});
					tbody.appendChild(tr);
				});
			}
		}

		fillPvpStats();

	}

	// Fill table with ai stats
	// Function to fill the table
	const fillAiTable = () => {
		// Clear the table
		statTable.innerHTML = '';

		// Create the table headers
		const thead = document.createElement('thead');
		const tr = document.createElement('tr');
		const columns = ['db date', 'db player', 'db ai lvl', 'db score', 'db winner', 'db duration'];
		columns.forEach(column => {
			const th = document.createElement('th');
			th.setAttribute('data-translate', column);
			tr.appendChild(th);
			updateTextForElem(th, column);
		});
		thead.appendChild(tr);
		statTable.appendChild(thead);

		// Create the table body
		const tbody = document.createElement('tbody');
		statTable.appendChild(tbody);

		// Get the ai stats and add them to the table
		const fillAiStats = async () => {
			console.log('Fetching ai stats');
			const response = await fetch(`${BASE_URL}/api/AIpong_match_history/`);
			console.log(response);
			if (response.status === 200) {
				const stats = await response.json();
				console.log(stats);

				// If there are no stats
				if (stats.length === 0) {
					const tr = document.createElement('tr');
					const td = document.createElement('td');
					td.setAttribute('colspan', '6');
					td.setAttribute('data-translate', 'no stats');
					updateTextForElem(td, 'no stats');
					tr.appendChild(td);
					tbody.appendChild(tr);
					return;
				}

				// Add the stats to the table
				stats.map(stat => {
					const tr = document.createElement('tr');
					const columns = ['match_date', 'player_one', 'ai_level', 'match_score', 'winner', 'match_duration'];
					columns.forEach(column => {
						const td = document.createElement('td');
						td.textContent = stat[column];
						tr.appendChild(td);
					});
					tbody.appendChild(tr);
				});
			}
		}

		fillAiStats();
	}

	// Fill table with tournament stats
	// Function to fill the table
	const fillTournamentTable = () => {
		// Clear the table
		statTable.innerHTML = '';

		// Create the table headers
		const thead = document.createElement('thead');
		const tr = document.createElement('tr');
		const columns = ['db date', 'db player 1', 'db player 2', 'db player 3', 'db player 4', 'db winner', 'db duration'];
		columns.forEach(column => {
			const th = document.createElement('th');
			th.setAttribute('data-translate', column);
			tr.appendChild(th);
			updateTextForElem(th, column);
		});
		thead.appendChild(tr);
		statTable.appendChild(thead);

		// Create the table body
		const tbody = document.createElement('tbody');
		statTable.appendChild(tbody);

		// Get the tournament stats and add them to the table
		const fillTournamentStats = async () => {
			console.log('Fetching tournament stats');
			const response = await fetch(`${BASE_URL}/api/TournamentPong_match_history/`);
			console.log(response);
			if (response.status === 200) {
				const stats = await response.json();
				console.log(stats);

				// If there are no stats
				if (stats.length === 0) {
					const tr = document.createElement('tr');
					const td = document.createElement('td');
					td.setAttribute('colspan', columns.length);
					td.setAttribute('data-translate', 'no stats');
					updateTextForElem(td, 'no stats');
					tr.appendChild(td);
					tbody.appendChild(tr);
					return;
				}

				// Add the stats to the table
				stats.map(stat => {
					const tr = document.createElement('tr');
					const columns = ['match_date', 'player_one', 'player_two', 'player_tree', 'player_four', 'winner', 'match_duration'];
					columns.forEach(column => {
						const td = document.createElement('td');
						td.textContent = stat[column];
						tr.appendChild(td);
					});
					tbody.appendChild(tr);
				});
			}
		}

		fillTournamentStats();
	}

	// Select the pvp stats by default
	pvpBtn.classList.add('selected');
	// Fill the table with pvp stats by default
	fillPvpTable();
	// Fill the global stats table
	fillGlobalStatTable();

	// Add Event Listener to each stat button
	pvpBtn.addEventListener('click', () => {
		// Remove the selected class from all buttons
		pvpBtn.classList.add('selected');
		aiBtn.classList.remove('selected');
		tournamentBtn.classList.remove('selected');

		// Fill the table with pvp stats
		fillPvpTable();
	});

	aiBtn.addEventListener('click', () => {
		// Remove the selected class from all buttons
		pvpBtn.classList.remove('selected');
		aiBtn.classList.add('selected');
		tournamentBtn.classList.remove('selected');

		// Fill the table with ai stats
		fillAiTable();
	});

	tournamentBtn.addEventListener('click', () => {
		// Remove the selected class from all buttons
		pvpBtn.classList.remove('selected');
		aiBtn.classList.remove('selected');
		tournamentBtn.classList.add('selected');

		// Fill the table with tournament stats
		fillTournamentTable();
	});
}