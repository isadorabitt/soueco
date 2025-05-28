document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('menu-toggle');
    const wrapper = document.getElementById('wrapper');
    const dashboardLinks = document.querySelectorAll('#sidebar-wrapper .list-group-item');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    if (sidebarToggle && wrapper) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            wrapper.classList.toggle('toggled');
            if (document.getElementById('overview-section').classList.contains('active')) {
                setTimeout(() => {
                    renderDashboardCharts();
                }, 100);
            }
        });
    }

    // Variáveis globais para armazenar instâncias de gráficos
    let pointsChartInstance = null;
    let materialRecyclingChartInstance = null;
    let dailyRecyclingChartInstance = null;

    function destroyAllCharts() {
        if (pointsChartInstance) {
            pointsChartInstance.destroy();
            pointsChartInstance = null;
        }
        if (materialRecyclingChartInstance) {
            materialRecyclingChartInstance.destroy();
            materialRecyclingChartInstance = null;
        }
        if (dailyRecyclingChartInstance) {
            dailyRecyclingChartInstance.destroy();
            dailyRecyclingChartInstance = null;
        }
    }

    function renderDashboardCharts() {
        destroyAllCharts();

        const pointsData = {
            labels: ['Vidro', 'Plástico', 'Papel', 'Metal', 'Orgânico'],
            datasets: [{
                label: 'Ecopontos (por Kg)',
                data: [10, 5, 3, 15, 0],
                backgroundColor: [
                    '#E64A19',
                    '#4CAF50',
                    '#2196F3',
                    '#FFC107',
                    '#673AB7'
                ],
                borderColor: [
                    '#D32F2F',
                    '#388E3C',
                    '#1976D2',
                    '#FFA000',
                    '#512DA8'
                ],
                borderWidth: 1
            }]
        };

        const materialRecyclingData = {
            labels: ['Vidro', 'Plástico', 'Papel', 'Metal', 'Orgânico'],
            datasets: [{
                label: 'Peso Reciclado (Kg)',
                data: [5000, 4000, 2000, 1000, 500],
                backgroundColor: [
                    '#00BCD4',
                    '#F44336',
                    '#8BC34A',
                    '#FF5722',
                    '#E91E63'
                ],
                borderColor: [
                    '#0097A7',
                    '#D32F2F',
                    '#689F38',
                    '#E64A19',
                    '#C2185B'
                ],
                borderWidth: 1
            }]
        };

        const dailyRecyclingData = {
            labels: ['20/05', '21/05', '22/05', '23/05', '24/05', '25/05', '26/05'],
            datasets: [{
                label: 'Kg Reciclados por Dia',
                data: [150, 180, 200, 170, 220, 190, 210],
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                borderColor: '#388E3C',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        };

        const ctxPoints = document.getElementById('pointsPerMaterialChart');
        if (ctxPoints) {
            pointsChartInstance = new Chart(ctxPoints, {
                type: 'doughnut',
                data: pointsData,
                options: {
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.parsed + ' Ecopontos/Kg';
                                }
                            }
                        }
                    }
                }
            });
        }

        const ctxMaterialRecycling = document.getElementById('materialRecyclingChart');
        if (ctxMaterialRecycling) {
            materialRecyclingChartInstance = new Chart(ctxMaterialRecycling, {
                type: 'bar',
                data: materialRecyclingData,
                options: {
                    scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Peso Reciclado (Kg)' } },
                        x: { title: { display: true, text: 'Tipo de Material' } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        const ctxDailyRecycling = document.getElementById('dailyRecyclingChart');
        if (ctxDailyRecycling) {
            dailyRecyclingChartInstance = new Chart(ctxDailyRecycling, {
                type: 'line',
                data: dailyRecyclingData,
                options: {
                    scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Kg Reciclados' } },
                        x: { title: { display: true, text: 'Data' } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    if (dashboardLinks.length > 0 && dashboardSections.length > 0) {
        // Mostrar a seção de usuários por padrão ao carregar a página
        const defaultSection = 'overview'; // Alterado de 'overview' para 'users'

        // Esconder todas as seções primeiro
        dashboardSections.forEach(section => section.classList.remove('active'));
        dashboardLinks.forEach(item => item.classList.remove('current-page'));

        // Mostrar a seção padrão
        const defaultSectionId = defaultSection + '-section';
        const defaultLink = document.querySelector(`[data-section="${defaultSection}"]`);

        if (document.getElementById(defaultSectionId) && defaultLink) {
            document.getElementById(defaultSectionId).classList.add('active');
            defaultLink.classList.add('current-page');

            // Se for a seção de overview, renderizar os gráficos
            if (defaultSection === 'overview') {
                setTimeout(() => {
                    renderDashboardCharts();
                }, 100);
            }
        }

        // Configurar os listeners para os links do menu
        dashboardLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetSectionId = this.dataset.section + '-section';

                dashboardSections.forEach(section => section.classList.remove('active'));
                dashboardLinks.forEach(item => item.classList.remove('current-page'));

                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    this.classList.add('current-page');
                }

                if (targetSectionId === 'overview-section') {
                    setTimeout(() => {
                        renderDashboardCharts();
                        populateTopRecyclersTable();
                    }, 100);
                } else {
                    destroyAllCharts();
                }
            });
        });
    }

    function populateTopRecyclersTable() {
        const topRecyclers = [
            { id: 1, name: 'João Silva', ecopoints: 5000, kgRecycled: 500, mostRecycled: 'Vidro' },
            { id: 2, name: 'Maria Santos', ecopoints: 4800, kgRecycled: 480, mostRecycled: 'Plástico' },
            { id: 3, name: 'Pedro Souza', ecopoints: 4500, kgRecycled: 450, mostRecycled: 'Metal' },
            { id: 4, name: 'Julia Lima', ecopoints: 4200, kgRecycled: 420, mostRecycled: 'Vidro' },
            { id: 5, name: 'Carlos Pereira', ecopoints: 4000, kgRecycled: 400, mostRecycled: 'Papel' },
            { id: 6, name: 'Fernanda Oliveira', ecopoints: 3800, kgRecycled: 380, mostRecycled: 'Plástico' },
            { id: 7, name: 'Ricardo Almeida', ecopoints: 3500, kgRecycled: 350, mostRecycled: 'Metal' },
            { id: 8, name: 'Beatriz Rocha', ecopoints: 3200, kgRecycled: 320, mostRecycled: 'Vidro' },
            { id: 9, name: 'Gustavo Fernandes', ecopoints: 3000, kgRecycled: 300, mostRecycled: 'Papel' },
            { id: 10, name: 'Camila Gomes', ecopoints: 2800, kgRecycled: 280, mostRecycled: 'Plástico' },
        ];

        const tableBody = document.getElementById('topRecyclersTableBody');
        if (tableBody) {
            tableBody.innerHTML = '';
            topRecyclers.forEach(user => {
                const row = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.ecopoints}</td>
                        <td>${user.kgRecycled}</td>
                        <td>${user.mostRecycled}</td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        }
    }

    function updateOverviewCards() {
        document.getElementById('totalUsers').textContent = '2.540';
        document.getElementById('totalRecycledWeight').textContent = '12.345';
        document.getElementById('totalEcopoints').textContent = '123.450';
        document.getElementById('totalSessions').textContent = '5.678';
    }

    if (document.body.id === 'dashboard-page') {
        updateOverviewCards();
    }
});