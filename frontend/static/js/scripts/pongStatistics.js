import { BASE_URL } from '../index.js';
import { updateTextForElem } from '../utils/languages.js';

// Function that will be called when the view is loaded
export function pongStatistics () {
	// Select elements
	const pvpBtn = document.getElementById('pvp-stat-btn');
	const aiBtn = document.getElementById('ai-stat-btn');
	const tournamentBtn = document.getElementById('tournament-stat-btn');

	const statTable = document.getElementById('pong-stat-table')

	// Select the pvp stats by default
	pvpBtn.classList.add('selected');

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
		});
		thead.appendChild(tr);
		statTable.appendChild(thead);

		// Create the table body
		const tbody = document.createElement('tbody');
		statTable.appendChild(tbody);

		// Get the pvp stats
		// Make a call to the API to get all the pvp stats
		// The response will be a JSON array where each element is a pvp stat row.
		// Map through the response array and add a row to the table for each element of the array.
		// If there are no pvp stats, display such a message.

		// Get the pvp stats
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

	// Fill the table with pvp stats by default
	fillPvpTable();	

	// Add Event Listener to each stat button
	


}