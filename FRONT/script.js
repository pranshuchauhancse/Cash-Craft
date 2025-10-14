// Cash Craft - Personal Finance Manager
class CashCraft {
    constructor() {
        this.currentUser = null;
        this.transactions = [];
        this.budgets = [];
        this.savingsGoals = [];
        this.categories = {
            income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'],
            expense: ['Food', 'Rent', 'Transport', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Utilities', 'Other']
        };
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.showLoadingScreen();
        this.setupTheme();
        
        // Set current date in quick add form
        document.getElementById('quickDate').value = new Date().toISOString().split('T')[0];
    }

    showLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.add('hidden');
            if (this.currentUser) {
                this.showDashboard();
            } else {
                this.showLogin();
            }
        }, 3000);
    }

    setupTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
    }

    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }

    setupEventListeners() {
        // Auth event listeners
        document.getElementById('showSignup').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSignup();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLogin();
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Dashboard event listeners
        document.addEventListener('DOMContentLoaded', () => {
            // Tab navigation
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabName = btn.getAttribute('data-tab');
                    this.switchTab(tabName);
                });
            });

            // Theme toggle
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', this.toggleTheme.bind(this));
            }

            // Logout
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', this.handleLogout.bind(this));
            }

            // Quick add form
            const quickAddForm = document.getElementById('quickAddForm');
            if (quickAddForm) {
                quickAddForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleQuickAdd();
                });
            }

            // Type change handler for categories
            const quickType = document.getElementById('quickType');
            if (quickType) {
                quickType.addEventListener('change', this.updateCategories.bind(this));
            }

            // Add transaction button
            const addTransactionBtn = document.getElementById('addTransactionBtn');
            if (addTransactionBtn) {
                addTransactionBtn.addEventListener('click', () => {
                    this.openTransactionModal();
                });
            }

            // Set budget button
            const setBudgetBtn = document.getElementById('setBudgetBtn');
            if (setBudgetBtn) {
                setBudgetBtn.addEventListener('click', () => {
                    this.openBudgetModal();
                });
            }

            // Add goal button
            const addGoalBtn = document.getElementById('addGoalBtn');
            if (addGoalBtn) {
                addGoalBtn.addEventListener('click', () => {
                    this.openGoalModal();
                });
            }

            // Export button
            const exportBtn = document.getElementById('exportBtn');
            if (exportBtn) {
                exportBtn.addEventListener('click', this.exportToCSV.bind(this));
            }

            // Filter event listeners
            const filterType = document.getElementById('filterType');
            const filterCategory = document.getElementById('filterCategory');
            const filterMonth = document.getElementById('filterMonth');

            if (filterType) filterType.addEventListener('change', this.applyFilters.bind(this));
            if (filterCategory) filterCategory.addEventListener('change', this.applyFilters.bind(this));
            if (filterMonth) filterMonth.addEventListener('change', this.applyFilters.bind(this));
        });
    }

    // Authentication Methods
    showLogin() {
        document.getElementById('loginSection').classList.add('active');
        document.getElementById('signupSection').classList.remove('active');
        document.getElementById('dashboardSection').classList.remove('active');
    }

    showSignup() {
        document.getElementById('signupSection').classList.add('active');
        document.getElementById('loginSection').classList.remove('active');
        document.getElementById('dashboardSection').classList.remove('active');
    }

    showDashboard() {
        document.getElementById('dashboardSection').classList.add('active');
        document.getElementById('loginSection').classList.remove('active');
        document.getElementById('signupSection').classList.remove('active');
        
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            this.initializeDashboard();
        }
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Simple authentication (in real app, this would be server-side)
        const users = JSON.parse(localStorage.getItem('cashcraft_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('cashcraft_currentUser', JSON.stringify(user));
            this.showNotification('Login successful!', 'success');
            this.showDashboard();
        } else {
            this.showNotification('Invalid email or password!', 'error');
        }
    }

    handleSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match!', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('cashcraft_users') || '[]');
        
        if (users.find(u => u.email === email)) {
            this.showNotification('Email already exists!', 'error');
            return;
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('cashcraft_users', JSON.stringify(users));
        
        this.currentUser = newUser;
        localStorage.setItem('cashcraft_currentUser', JSON.stringify(newUser));
        
        this.showNotification('Account created successfully!', 'success');
        this.showDashboard();
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('cashcraft_currentUser');
        this.showNotification('Logged out successfully!', 'success');
        this.showLogin();
    }

    // Dashboard Methods
    initializeDashboard() {
        this.updateCategories();
        this.loadTransactions();
        this.loadBudgets();
        this.loadSavingsGoals();
        this.updateSummaryCards();
        this.updateCharts();
        this.updateRecentTransactions();
        this.updateFilterCategories();
        this.switchTab('dashboard');
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        // Update content based on tab
        if (tabName === 'expenses') {
            this.updateAllTransactions();
        } else if (tabName === 'budget') {
            this.updateBudgetCards();
            this.updateGoalsGrid();
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateCategories() {
        const typeSelect = document.getElementById('quickType');
        const categorySelect = document.getElementById('quickCategory');
        
        if (!typeSelect || !categorySelect) return;
        
        const selectedType = typeSelect.value;
        categorySelect.innerHTML = '<option value="">Category</option>';
        
        if (selectedType && this.categories[selectedType]) {
            this.categories[selectedType].forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        }
    }

    updateFilterCategories() {
        const filterCategory = document.getElementById('filterCategory');
        if (!filterCategory) return;
        
        filterCategory.innerHTML = '<option value="">All Categories</option>';
        
        const allCategories = [...this.categories.income, ...this.categories.expense];
        const uniqueCategories = [...new Set(allCategories)];
        
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filterCategory.appendChild(option);
        });
    }

    // Transaction Methods
    handleQuickAdd() {
        const type = document.getElementById('quickType').value;
        const amount = parseFloat(document.getElementById('quickAmount').value);
        const category = document.getElementById('quickCategory').value;
        const date = document.getElementById('quickDate').value;
        const description = document.getElementById('quickDescription').value || '';

        if (!type || !amount || !category || !date) {
            this.showNotification('Please fill all required fields!', 'error');
            return;
        }

        const transaction = {
            id: Date.now(),
            type,
            amount,
            category,
            date,
            description,
            userId: this.currentUser.id,
            createdAt: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.saveTransactions();
        this.updateSummaryCards();
        this.updateCharts();
        this.updateRecentTransactions();
        
        // Reset form
        document.getElementById('quickAddForm').reset();
        document.getElementById('quickDate').value = new Date().toISOString().split('T')[0];
        
        this.showNotification(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`, 'success');
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.updateSummaryCards();
            this.updateCharts();
            this.updateRecentTransactions();
            this.updateAllTransactions();
            this.showNotification('Transaction deleted successfully!', 'success');
        }
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            this.openTransactionModal(transaction);
        }
    }

    openTransactionModal(transaction = null) {
        // This would open a modal for adding/editing transactions
        // For now, we'll use a simple prompt system
        
        const type = prompt('Type (income/expense):', transaction ? transaction.type : 'expense');
        const amount = prompt('Amount:', transaction ? transaction.amount : '');
        const category = prompt('Category:', transaction ? transaction.category : '');
        const date = prompt('Date (YYYY-MM-DD):', transaction ? transaction.date : new Date().toISOString().split('T')[0]);
        const description = prompt('Description:', transaction ? transaction.description : '');

        if (type && amount && category && date) {
            if (transaction) {
                // Edit existing transaction
                transaction.type = type;
                transaction.amount = parseFloat(amount);
                transaction.category = category;
                transaction.date = date;
                transaction.description = description;
            } else {
                // Add new transaction
                const newTransaction = {
                    id: Date.now(),
                    type,
                    amount: parseFloat(amount),
                    category,
                    date,
                    description,
                    userId: this.currentUser.id,
                    createdAt: new Date().toISOString()
                };
                this.transactions.push(newTransaction);
            }
            
            this.saveTransactions();
            this.updateSummaryCards();
            this.updateCharts();
            this.updateRecentTransactions();
            this.updateAllTransactions();
            this.showNotification('Transaction saved successfully!', 'success');
        }
    }

    // Budget Methods
    openBudgetModal() {
        const category = prompt('Category:');
        const amount = prompt('Budget Amount:');
        const month = prompt('Month (YYYY-MM):', new Date().toISOString().slice(0, 7));

        if (category && amount && month) {
            const existingBudget = this.budgets.find(b => b.category === category && b.month === month);
            
            if (existingBudget) {
                existingBudget.amount = parseFloat(amount);
            } else {
                const newBudget = {
                    id: Date.now(),
                    category,
                    amount: parseFloat(amount),
                    month,
                    userId: this.currentUser.id,
                    createdAt: new Date().toISOString()
                };
                this.budgets.push(newBudget);
            }
            
            this.saveBudgets();
            this.updateBudgetCards();
            this.showNotification('Budget saved successfully!', 'success');
        }
    }

    // Savings Goals Methods
    openGoalModal() {
        const title = prompt('Goal Title:');
        const targetAmount = prompt('Target Amount:');
        const targetDate = prompt('Target Date (YYYY-MM-DD):');
        const currentAmount = prompt('Current Amount:', '0');

        if (title && targetAmount && targetDate) {
            const newGoal = {
                id: Date.now(),
                title,
                targetAmount: parseFloat(targetAmount),
                currentAmount: parseFloat(currentAmount),
                targetDate,
                userId: this.currentUser.id,
                createdAt: new Date().toISOString()
            };
            
            this.savingsGoals.push(newGoal);
            this.saveSavingsGoals();
            this.updateGoalsGrid();
            this.updateSummaryCards();
            this.showNotification('Savings goal created successfully!', 'success');
        }
    }

    updateGoal(id, amount) {
        const goal = this.savingsGoals.find(g => g.id === id);
        if (goal) {
            const newAmount = prompt('Add to savings:', '');
            if (newAmount && !isNaN(newAmount)) {
                goal.currentAmount += parseFloat(newAmount);
                this.saveSavingsGoals();
                this.updateGoalsGrid();
                this.updateSummaryCards();
                this.showNotification('Savings updated successfully!', 'success');
            }
        }
    }

    deleteGoal(id) {
        if (confirm('Are you sure you want to delete this goal?')) {
            this.savingsGoals = this.savingsGoals.filter(g => g.id !== id);
            this.saveSavingsGoals();
            this.updateGoalsGrid();
            this.updateSummaryCards();
            this.showNotification('Goal deleted successfully!', 'success');
        }
    }

    // Update Methods
    updateSummaryCards() {
        const userTransactions = this.transactions.filter(t => t.userId === this.currentUser.id);
        
        const totalIncome = userTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = userTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalBalance = totalIncome - totalExpenses;
        
        const totalSavings = this.savingsGoals
            .filter(g => g.userId === this.currentUser.id)
            .reduce((sum, g) => sum + g.currentAmount, 0);

        document.getElementById('totalIncome').textContent = `₹${totalIncome.toLocaleString()}`;
        document.getElementById('totalExpenses').textContent = `₹${totalExpenses.toLocaleString()}`;
        document.getElementById('totalBalance').textContent = `₹${totalBalance.toLocaleString()}`;
        document.getElementById('totalSavings').textContent = `₹${totalSavings.toLocaleString()}`;
    }

    updateRecentTransactions() {
        const userTransactions = this.transactions
            .filter(t => t.userId === this.currentUser.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        const tbody = document.getElementById('transactionsTableBody');
        tbody.innerHTML = '';

        userTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>${transaction.category}</td>
                <td>${transaction.description || '-'}</td>
                <td class="transaction-${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toLocaleString()}
                </td>
                <td>
                    <button class="action-btn edit-btn" onclick="cashCraft.editTransaction(${transaction.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="cashCraft.deleteTransaction(${transaction.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateAllTransactions() {
        let userTransactions = this.transactions.filter(t => t.userId === this.currentUser.id);
        
        // Apply filters
        const filterType = document.getElementById('filterType').value;
        const filterCategory = document.getElementById('filterCategory').value;
        const filterMonth = document.getElementById('filterMonth').value;

        if (filterType) {
            userTransactions = userTransactions.filter(t => t.type === filterType);
        }
        
        if (filterCategory) {
            userTransactions = userTransactions.filter(t => t.category === filterCategory);
        }
        
        if (filterMonth) {
            userTransactions = userTransactions.filter(t => t.date.startsWith(filterMonth));
        }

        userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        const tbody = document.getElementById('allTransactionsTableBody');
        tbody.innerHTML = '';

        userTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td><span class="transaction-${transaction.type}">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span></td>
                <td>${transaction.category}</td>
                <td>${transaction.description || '-'}</td>
                <td class="transaction-${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toLocaleString()}
                </td>
                <td>
                    <button class="action-btn edit-btn" onclick="cashCraft.editTransaction(${transaction.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="cashCraft.deleteTransaction(${transaction.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateBudgetCards() {
        const budgetCards = document.getElementById('budgetCards');
        budgetCards.innerHTML = '';

        const userBudgets = this.budgets.filter(b => b.userId === this.currentUser.id);
        const currentMonth = new Date().toISOString().slice(0, 7);

        userBudgets.forEach(budget => {
            const spent = this.transactions
                .filter(t => t.userId === this.currentUser.id && 
                            t.type === 'expense' && 
                            t.category === budget.category && 
                            t.date.startsWith(budget.month))
                .reduce((sum, t) => sum + t.amount, 0);

            const percentage = (spent / budget.amount) * 100;
            const isOverBudget = percentage > 100;

            const card = document.createElement('div');
            card.className = 'budget-card';
            card.innerHTML = `
                <h3>${budget.category}</h3>
                <div class="budget-progress">
                    <div class="budget-progress-bar" style="width: ${Math.min(percentage, 100)}%; background: ${isOverBudget ? 'var(--error-color)' : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))'}"></div>
                </div>
                <div class="budget-info">
                    <span>Spent: ₹${spent.toLocaleString()}</span>
                    <span>Budget: ₹${budget.amount.toLocaleString()}</span>
                </div>
                <div class="budget-info">
                    <span style="color: ${isOverBudget ? 'var(--error-color)' : 'var(--success-color)'}">
                        ${percentage.toFixed(1)}% ${isOverBudget ? 'Over Budget' : 'of Budget'}
                    </span>
                    <span>Month: ${budget.month}</span>
                </div>
            `;
            budgetCards.appendChild(card);
        });
    }

    updateGoalsGrid() {
        const goalsGrid = document.getElementById('goalsGrid');
        goalsGrid.innerHTML = '';

        const userGoals = this.savingsGoals.filter(g => g.userId === this.currentUser.id);

        userGoals.forEach(goal => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));

            const card = document.createElement('div');
            card.className = 'goal-card';
            card.innerHTML = `
                <div class="goal-header">
                    <h3>${goal.title}</h3>
                    <button class="action-btn delete-btn" onclick="cashCraft.deleteGoal(${goal.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="goal-progress">
                    <div class="goal-progress-bar" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
                <div class="goal-info">
                    <div class="goal-amount">
                        ₹${goal.currentAmount.toLocaleString()} / ₹${goal.targetAmount.toLocaleString()}
                    </div>
                    <div class="goal-percentage">${percentage.toFixed(1)}%</div>
                </div>
                <div class="goal-info">
                    <span>Target: ${new Date(goal.targetDate).toLocaleDateString()}</span>
                    <span style="color: ${daysLeft < 0 ? 'var(--error-color)' : 'var(--text-secondary)'}">
                        ${daysLeft < 0 ? 'Overdue' : `${daysLeft} days left`}
                    </span>
                </div>
                <button class="btn-primary" onclick="cashCraft.updateGoal(${goal.id})" style="margin-top: 1rem; width: 100%;">
                    Add to Savings
                </button>
            `;
            goalsGrid.appendChild(card);
        });
    }

    updateCharts() {
        this.updateExpenseChart();
        this.updateIncomeExpenseChart();
    }

    updateExpenseChart() {
        const ctx = document.getElementById('expenseChart');
        if (!ctx) return;

        const userExpenses = this.transactions
            .filter(t => t.userId === this.currentUser.id && t.type === 'expense');

        const categoryData = {};
        userExpenses.forEach(transaction => {
            categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
        });

        const labels = Object.keys(categoryData);
        const data = Object.values(categoryData);
        const colors = [
            '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
            '#ef4444', '#84cc16', '#f97316', '#ec4899', '#14b8a6'
        ];

        if (this.expenseChart) {
            this.expenseChart.destroy();
        }

        this.expenseChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    updateIncomeExpenseChart() {
        const ctx = document.getElementById('incomeExpenseChart');
        if (!ctx) return;

        const userTransactions = this.transactions.filter(t => t.userId === this.currentUser.id);
        
        // Get last 6 months data
        const monthsData = {};
        const now = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toISOString().slice(0, 7);
            const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            monthsData[monthKey] = {
                label: monthLabel,
                income: 0,
                expense: 0
            };
        }

        userTransactions.forEach(transaction => {
            const monthKey = transaction.date.slice(0, 7);
            if (monthsData[monthKey]) {
                monthsData[monthKey][transaction.type] += transaction.amount;
            }
        });

        const labels = Object.values(monthsData).map(m => m.label);
        const incomeData = Object.values(monthsData).map(m => m.income);
        const expenseData = Object.values(monthsData).map(m => m.expense);

        if (this.incomeExpenseChart) {
            this.incomeExpenseChart.destroy();
        }

        this.incomeExpenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        backgroundColor: '#10b981',
                        borderColor: '#059669',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        backgroundColor: '#ef4444',
                        borderColor: '#dc2626',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    }
                }
            }
        });
    }

    // Filter and Export Methods
    applyFilters() {
        this.updateAllTransactions();
    }

    exportToCSV() {
        const userTransactions = this.transactions.filter(t => t.userId === this.currentUser.id);
        
        if (userTransactions.length === 0) {
            this.showNotification('No transactions to export!', 'error');
            return;
        }

        const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
        const csvContent = [
            headers.join(','),
            ...userTransactions.map(t => [
                t.date,
                t.type,
                t.category,
                `"${t.description || ''}"`,
                t.amount
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cashcraft_transactions_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Transactions exported successfully!', 'success');
    }

    // Data Management Methods
    loadData() {
        this.currentUser = JSON.parse(localStorage.getItem('cashcraft_currentUser'));
        this.loadTransactions();
        this.loadBudgets();
        this.loadSavingsGoals();
    }

    loadTransactions() {
        this.transactions = JSON.parse(localStorage.getItem('cashcraft_transactions') || '[]');
    }

    saveTransactions() {
        localStorage.setItem('cashcraft_transactions', JSON.stringify(this.transactions));
    }

    loadBudgets() {
        this.budgets = JSON.parse(localStorage.getItem('cashcraft_budgets') || '[]');
    }

    saveBudgets() {
        localStorage.setItem('cashcraft_budgets', JSON.stringify(this.budgets));
    }

    loadSavingsGoals() {
        this.savingsGoals = JSON.parse(localStorage.getItem('cashcraft_savingsGoals') || '[]');
    }

    saveSavingsGoals() {
        localStorage.setItem('cashcraft_savingsGoals', JSON.stringify(this.savingsGoals));
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add notification styles if not already added
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-success {
                    background: var(--success-color);
                }
                .notification-error {
                    background: var(--error-color);
                }
                .notification-info {
                    background: var(--primary-color);
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the application
const cashCraft = new CashCraft();