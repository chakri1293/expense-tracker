document.addEventListener("DOMContentLoaded", function() {
    const sheetId = '1Mznhuldu0_npBNyh_db8mLHJy4WlKWwHPdzUa7X972I';
    const apiKey = 'AIzaSyAongdPYT8AAWpq0ikoIUU_0mF0RqOnz94';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            const labels = [];
            const amounts = [];
            
            rows.slice(1).forEach(row => {
                labels.push(row[0]); // Assuming the date is in the first column
                amounts.push(row[4]); // Assuming the amount is in the fifth column
            });

            const ctx = document.getElementById('expenseChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Expenses',
                        data: amounts,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
