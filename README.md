git status
# Cash Craft - Personal Finance Manager

A comprehensive personal finance management web application built with HTML, CSS, and JavaScript. Cash Craft helps you track income, expenses, set budgets, and achieve your savings goals with an intuitive and modern interface.

## 🌟 Features

### 🔐 User Management
- **Login/Signup System**: Secure authentication with local storage
- **Profile Dashboard**: Manage personal information, preferences, and settings
- **User Statistics**: Track total transactions, budgets, and savings goals
- **Account Security**: Password management and security settings

### 💰 Transaction Management
- **Quick Add**: Fast transaction entry from the dashboard
- **Detailed Forms**: Complete transaction management with categories and descriptions
- **Edit/Delete**: Full CRUD operations for all transactions
- **Date Tracking**: Precise date-based transaction recording
- **Categories**: Pre-defined categories for income and expenses
  - **Income**: Salary, Freelance, Business, Investment, Gift, Bonus, Rental, Other
  - **Expenses**: Food, Rent, Transport, Shopping, Entertainment, Healthcare, Education, Utilities, Insurance, Travel, Other

### 📊 Budget & Analytics
- **Monthly Budgets**: Set spending limits for different categories
- **Progress Tracking**: Visual progress bars and alerts
- **Budget Alerts**: Notifications when approaching limits
- **Budget Overview**: Comprehensive budget management dashboard

### 📈 Data Visualization
- **Pie Charts**: Expense distribution by category
- **Bar Charts**: Income vs Expense comparison over time
- **Real-time Updates**: Charts update automatically with new data
- **Responsive Charts**: Built with Chart.js for optimal performance

### 🏠 Dashboard Features
- **Summary Cards**: Total Income, Expenses, Balance, and Savings
- **Quick Actions**: Fast transaction entry
- **Recent Transactions**: Table view with Date, Category, Description, Amount
- **Visual Analytics**: Integrated charts for spending insights

### 🎯 Savings Goals
- **Goal Creation**: Set specific savings targets with deadlines
- **Progress Tracking**: Visual progress bars and percentage completion
- **Goal Categories**: Emergency Fund, Vacation, Vehicle, Home, Education, etc.
- **Monthly Planning**: Suggested monthly savings amounts
- **Goal Management**: Add to savings, edit, or delete goals

### 🎨 User Experience
- **Dark Mode Toggle**: Switch between light and dark themes
- **Responsive Design**: Mobile-friendly across all devices
- **Three Main Tabs**: Dashboard, Expenses, Budget
- **Intuitive Navigation**: Clean and organized interface
- **Modal Dialogs**: Separate HTML files for different functions

### 📤 Export & Reporting
- **CSV Export**: Download transaction history
- **Data Filtering**: Filter by type, category, and date range
- **Transaction History**: Complete searchable transaction table

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Download all files to a folder on your computer
2. Open `index.html` in your web browser
3. Create an account or use the demo login

### File Structure
```
cash-craft/
├── index.html              # Main application file
├── styles.css              # Main stylesheet
├── script.js               # Main JavaScript functionality
├── modal-styles.css        # Shared modal styles
├── transaction-modal.html  # Add/Edit transaction dialog
├── budget-modal.html       # Budget management dialog
├── savings-goal-modal.html # Savings goal dialog
├── profile-modal.html      # User profile dialog
└── README.md              # This file
```

## 🎯 How to Use

### 1. Getting Started
1. Open the application in your browser
2. Sign up for a new account or log in
3. Complete the loading screen intro

### 2. Dashboard Tab
- View your financial summary in the top cards
- Use the Quick Add form to rapidly enter transactions
- Monitor recent transactions in the table
- Analyze spending with integrated charts

### 3. Expenses Tab
- View all transactions in a comprehensive table
- Filter by type (income/expense), category, or month
- Edit or delete existing transactions
- Export data to CSV format

### 4. Budget Tab
- Set monthly budgets for different categories
- Monitor budget progress with visual indicators
- Create and manage savings goals
- Track progress towards financial targets

### 5. Adding Transactions
- Click "Add Transaction" or use Quick Add form
- Select transaction type (Income/Expense)
- Choose appropriate category
- Enter amount and date
- Add optional description and tags

### 6. Setting Budgets
- Click "Set Budget" in the Budget tab
- Choose category and set amount
- Select month and budget type
- Set warning thresholds for alerts

### 7. Creating Savings Goals
- Click "Add Goal" in the Budget tab
- Set goal title and target amount
- Choose target date and category
- Track progress and add to savings regularly

## 🎨 Customization

### Themes
- Toggle between light and dark modes using the theme button
- Themes are automatically saved and persist across sessions

### Categories
- Categories are pre-defined but can be extended in the `script.js` file
- Modify the `categories` object to add custom categories

### Currency
- Default currency is Indian Rupee (₹)
- Can be changed in user profile settings
- Supports multiple international currencies

## 💾 Data Storage

### Local Storage
- All data is stored locally in your browser
- No external servers or databases required
- Data persists between sessions
- Export functionality available for backups

### Data Security
- Data never leaves your device
- Secure local authentication
- Password-protected accounts
- Profile and preference management

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Application logic and interactivity
- **Chart.js**: Data visualization library
- **Font Awesome**: Icon library
- **Local Storage API**: Data persistence

### Browser Compatibility
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

### Performance Features
- Optimized asset loading
- Efficient DOM manipulation
- Responsive image handling
- Smooth animations and transitions

## 📱 Mobile Support

Cash Craft is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Adaptive layouts for all screen sizes
- Mobile-optimized forms and modals
- Swipe and gesture support

## 🔒 Privacy & Security

- **No Data Collection**: All data stays on your device
- **Local Authentication**: Secure login without external servers
- **Privacy First**: No tracking or analytics
- **Secure Storage**: Encrypted local storage options

## 🛠️ Troubleshooting

### Common Issues
1. **Data Not Saving**: Ensure browser allows local storage
2. **Charts Not Loading**: Check if Chart.js is properly loaded
3. **Modal Issues**: Verify all HTML files are in the same directory
4. **Mobile Issues**: Clear browser cache and reload

### Browser Support
If you experience issues:
1. Update your browser to the latest version
2. Enable JavaScript and local storage
3. Clear browser cache
4. Disable browser extensions that might interfere

## 🚀 Future Enhancements

Potential features for future versions:
- Multi-user support
- Cloud synchronization
- Advanced reporting
- Receipt scanning
- Bank integration
- Investment tracking
- Bill reminders

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📞 Support

For support or questions, please refer to the documentation or create an issue in the project repository.

---

**Cash Craft** - Take control of your finances with style! 💰✨