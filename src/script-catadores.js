document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('menu-toggle');
    const wrapper = document.getElementById('wrapper');
    const dashboardLinks = document.querySelectorAll('#sidebar-wrapper .list-group-item');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    // Variáveis globais para armazenar instâncias de gráficos do catador
    let myMaterialsChartInstance = null;
    let myMonthlyChartInstance = null;

    // Função para destruir gráficos existentes
    function destroyCatadorCharts() {
        if (myMaterialsChartInstance) {
            myMaterialsChartInstance.destroy();
            myMaterialsChartInstance = null;
        }
        if (myMonthlyChartInstance) {
            myMonthlyChartInstance.destroy();
            myMonthlyChartInstance = null;
        }
    }

    // Função para renderizar os gráficos do catador
    function renderCatadorCharts() {
        destroyCatadorCharts(); // Sempre destrua antes de renderizar para evitar duplicatas

        // Dados de exemplo para os gráficos do catador
        const myMaterialsData = {
            labels: ['Plástico PET', 'Papelão', 'Metal', 'Vidro', 'Orgânico'],
            datasets: [{
                label: 'Meus Materiais Coletados (Kg)',
                data: [45, 30, 20, 10, 5],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FFC107',
                    '#9C27B0',
                    '#795548'
                ],
                borderColor: [
                    '#388E3C',
                    '#1976D2',
                    '#FFA000',
                    '#7B1FA2',
                    '#5D4037'
                ],
                borderWidth: 1
            }]
        };

        const myMonthlyData = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'], // Últimos 5 meses
            datasets: [{
                label: 'Ecopontos Ganhos por Mês',
                data: [200, 250, 300, 350, 400],
                backgroundColor: 'rgba(255, 193, 7, 0.6)',
                borderColor: '#FFC107',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        };

        // Obter o contexto do canvas e criar o gráfico de materiais
        const ctxMyMaterials = document.getElementById('myMaterialsChart');
        if (ctxMyMaterials) { // Verifique se o canvas existe antes de tentar criar o gráfico
            myMaterialsChartInstance = new Chart(ctxMyMaterials, {
                type: 'bar',
                data: myMaterialsData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Isso é importante para o gráfico se ajustar ao contêiner
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Quantidade (Kg)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Material'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Obter o contexto do canvas e criar o gráfico de evolução mensal
        const ctxMyMonthly = document.getElementById('myMonthlyChart');
        if (ctxMyMonthly) { // Verifique se o canvas existe antes de tentar criar o gráfico
            myMonthlyChartInstance = new Chart(ctxMyMonthly, {
                type: 'line',
                data: myMonthlyData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Importante para o ajuste
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Ecopontos'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Mês'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    // Função para atualizar os cards de resumo do catador
    function updateCatadorOverviewCards() {
        const ecopoints = 1250;
        const recycledWeight = 125;

        document.getElementById('myEcopoints').textContent = ecopoints.toLocaleString('pt-BR');
        document.getElementById('myRecycledWeight').textContent = recycledWeight.toLocaleString('pt-BR');
    }

    // Gerenciamento da Sidebar e Seções
    if (sidebarToggle && wrapper) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            wrapper.classList.toggle('toggled');
            // Ao expandir/recolher a sidebar, re-renderize os gráficos se a seção de desempenho estiver ativa
            if (document.getElementById('overview-section').classList.contains('active')) {
                setTimeout(() => { // Pequeno delay para garantir que a transição CSS seja completa
                    renderCatadorCharts();
                }, 300); // Aumentei o delay para 300ms
            }
        });
    }

    if (dashboardLinks.length > 0 && dashboardSections.length > 0) {
        const defaultSection = 'overview'; // Seção padrão ao carregar a página

        // Esconder todas as seções e remover a classe 'current-page' dos links
        dashboardSections.forEach(section => section.classList.remove('active'));
        dashboardLinks.forEach(item => item.classList.remove('current-page'));

        // Ativar a seção padrão e seu link correspondente
        const defaultSectionElement = document.getElementById(defaultSection + '-section');
        const defaultLinkElement = document.querySelector(`[data-section="${defaultSection}"]`);

        if (defaultSectionElement && defaultLinkElement) {
            defaultSectionElement.classList.add('active');
            defaultLinkElement.classList.add('current-page');

            // Se a seção padrão for "overview", renderize os gráficos imediatamente
            if (defaultSection === 'overview') {
                // Use um pequeno delay para garantir que a DOM esteja pronta após o Bootstrap
                setTimeout(() => {
                    renderCatadorCharts();
                }, 100);
            }
        }

        // Adicionar listeners de clique para os links da sidebar
        dashboardLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetSectionId = this.dataset.section + '-section';

                // Esconder todas as seções e remover 'current-page'
                dashboardSections.forEach(section => section.classList.remove('active'));
                dashboardLinks.forEach(item => item.classList.remove('current-page'));

                // Ativar a seção clicada e seu link
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    this.classList.add('current-page');
                }

                // Renderizar ou destruir gráficos com base na seção ativa
                if (targetSectionId === 'overview-section') {
                    // Use um pequeno delay para garantir que o canvas esteja visível
                    setTimeout(() => {
                        renderCatadorCharts();
                    }, 100);
                } else {
                    destroyCatadorCharts(); // Destrói gráficos quando a seção não é a de desempenho
                }
            });
        });
    }

    // Chama a função para atualizar os cards ao carregar a página
    // Isso deve ser chamado fora do bloco 'if (document.body.id === 'dashboard-page')'
    // ou dentro de um DOMContentLoaded para garantir que os elementos existam.
    updateCatadorOverviewCards();
});