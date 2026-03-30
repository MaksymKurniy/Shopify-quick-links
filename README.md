# Shopify Quick Links

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/MaksymKurniy/shopify-quick-links)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A Visual Studio Code extension that provides quick access to Shopify store admin, documentation and developer resources directly from the sidebar.

![Shopify Quick Links](https://via.placeholder.com/800x400.png?text=Shopify+Quick+Links+Screenshot)

## ✨ Features

- 🏪 **Store Integration** - Direct links to your Shopify store admin, products, themes, and analytics
- ⚙️ **Configurable Store Handle** - Set your store handle or automatically use workspace name
- 🚀 **Quick Actions** - Run Shopify CLI commands and VS Code tasks directly from the panel
- 📌 **Quick Links** - Instant access to Shopify documentation and resources
- 🌐 **Dynamic Links** - Smart links that adapt to your current project
- 🎨 **Theme Integration** - Automatically adapts to your VS Code theme
- 🛠️ **Developer Tools** - Links to GraphQL API, Liquid docs, and Shopify CLI

## 📦 Installation

### From VSIX

1. Download the latest `.vsix` file from [Releases](https://github.com/MaksymKurniy/shopify-quick-links/releases)
2. Open VS Code
3. Go to Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
4. Click on the `...` menu at the top
5. Select "Install from VSIX..."
6. Choose the downloaded `.vsix` file

### From Marketplace *(Coming Soon)*

Search for "Shopify Quick Links" in the VS Code Extensions marketplace.

## 🚀 Usage

1. Click on the Shopify icon in the Activity Bar (left sidebar)
2. **First time setup:** Click "🏪 Set Store Handle" to configure your store
3. Browse through the categorized links and actions
4. Click any item to open it in your browser or execute the action

## ⚙️ Configuration

### Store Handle Setup

The extension needs your Shopify store handle to generate store-specific links. You can set it in two ways:

#### Option 1: Using the Panel (Recommended)
1. Open the Shopify Quick Links panel
2. Click "🏪 Set Store Handle" in the Actions section
3. Enter your store handle (e.g., "my-awesome-store")

### 📌 Quick Links
- **Shopify Documentation** - Official dev docs
- **Shopify Admin** - Partner dashboard
- **Community Forums** - Get help from other developers
- **GitHub** - Code repository platform

### 🛠️ Developer Tools  
- **Shopify CLI** - Command line interface docs
- **GraphQL Admin API** - API documentation
- **Liquid Templates** - Template language docs
- **Shopify Scripts** - Checkout scripts documentation

### 📚 Documentation
- **Theme Development** - Build custom themes
- **App Development** - Create Shopify apps
- **Storefront API** - Headless commerce API
- **Webhooks** - Real-time notifications

### 🌐 Dynamic Links *(Adapt to your current project)*
- **GitHub Project** - Open current project on GitHub
- **GitHub Issues** - View project issues
- **Pull Requests** - Review project PRs
- **NPM Package** - Find your package on NPM

## 🛠️ Requirements

- Visual Studio Code v1.54.0 or higher
- Shopify CLI (optional, for theme development actions)

## ⚙️ Extension Settings

This extension contributes the following settings:

* `shopifyQuickLinks.storeHandle`: Your Shopify store handle (without .myshopify.com)
## 🎯 Available Links & Actions

### 🚀 Actions
- **Set Store Handle** - Configure your Shopify store handle
- **Shopify Theme Dev** - Run `shopify theme dev` command
- **Pull Theme JSON** - Pull only JSON files from your theme
- **Open Terminal** - Open a new terminal window
- **Reload Window** - Restart VS Code

### 🏪 Store Links *(Dynamic based on your store handle)*
- **Store Frontend** - `https://your-store.myshopify.com`
- **Store Admin** - Admin dashboard
- **Products** - Product management
- **Analytics** - Store analytics and reports  
- **Themes** - Theme editor and management
- **Settings** - Store configuration

## 🛠️ Customization

You can customize the links by editing [`src/sidebarProvider.js`](src/sidebarProvider.js):

```javascript
<li><a href="#" onclick="openLink('https://your-link.com'); return false;">🔗 Your Link</a></li>
```

## 👨‍💻 Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Visual Studio Code](https://code.visualstudio.com/)

### Setup

```bash
# Clone the repository
git clone https://github.com/MaksymKurniy/shopify-quick-links.git
cd shopify-quick-links

# Install dependencies
npm install

# Open in VS Code
code .
```

### Running the Extension

1. Press `F5` to open a new Extension Development Host window
2. The extension will be loaded and ready to test
3. Click the Shopify icon in the Activity Bar to see the sidebar

### Building

```bash
# Create a .vsix package
npm run package
```

## 📁 Project Structure

```
shopify-quick-links/
├── .vscode/
│   └── launch.json          # Debug configuration
├── media/
│   └── shopify_glyph_black.svg  # Sidebar icon
├── src/
│   ├── extension.js         # Extension activation
│   └── sidebarProvider.js   # Webview provider for sidebar
├── .gitignore
├── .vscodeignore           # Files to exclude from package
├── CHANGELOG.md            # Version history
├── package.json            # Extension manifest
└── README.md               # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for quick access to developer resources
- Built with ❤️ for the VS Code community

## 📧 Contact

**Maksym Kurniy** - [@MaksymKurniy](https://github.com/MaksymKurniy)

Project Link: [https://github.com/MaksymKurniy/shopify-quick-links](https://github.com/MaksymKurniy/shopify-quick-links)

---

**Enjoy coding! 🚀**

