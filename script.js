document.addEventListener("DOMContentLoaded", function() {
        const sheetId = '1Mznhuldu0_npBNyh_db8mLHJy4WlKWwHPdzUa7X972I'; 
        const apiKey = 'AIzaSyAongdPYT8AAWpq0ikoIUU_0mF0RqOnz94';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:append?valueInputOption=USER_ENTERED&key=${apiKey}`;
        const form = document.getElementById('expenseForm');
        const chartCtx = document.getElementById('expenseChart').getContext('2d');
        let chart;
    
        form.addEventListener('submit', function(event) {
            event.preventDefault();
    
            const date = document.getElementById('date').value;
            const category = document.getElementById('category').value;
            const subcategory = document.getElementById('subcategory').value;
            const amount = document.getElementById('amount').value;
    
            const values = [
                [date, category, subcategory, amount]
            ];
    
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    range: 'Sheet1',
                    majorDimension: 'ROWS',
                    values: values
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error:', data.error);
                } else {
                    updateChart();
                    form.reset();
                }
            })
            .catch(error => console.error('Error:', error));
        });
    
        function fetchData() {
            const fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;
            return fetch(fetchUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        throw new Error(data.error.message);
                    }
                    return data.values;
                });
        }
    
        function updateChart() {
            fetchData().then(rows => {
                const categories = {};
                rows.slice(1).forEach(row => {
                    const category = row[1];
                    const amount = parseFloat(row[3]);
                    if (categories[category]) {
                        categories[category] += amount;
                    } else {
                        categories[category] = amount;
                    }
                });
    
                const labels = Object.keys(categories);
                const data = Object.values(categories);
    
                if (chart) {
                    chart.destroy();
                }
    
                chart = new Chart(chartCtx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Expenses',
                            data: data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Expenses by Category'
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error fetching data:', error));
        }
    
        updateChart();
    });
    