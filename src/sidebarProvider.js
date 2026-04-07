const vscode = require('vscode');

// Tree item classes
class LinkItem extends vscode.TreeItem {
  constructor(label, url, icon, tooltip) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = tooltip || label;
    this.iconPath = new vscode.ThemeIcon(icon);
    this.command = {
      command: 'quickLinks.openUrl',
      title: 'Open Link',
      arguments: [url],
    };
    this.contextValue = 'link';
  }
}

class CommandItem extends vscode.TreeItem {
  constructor(label, commandId, icon, tooltip) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = tooltip || label;
    this.iconPath = new vscode.ThemeIcon(icon);
    this.command = {
      command: commandId,
      title: label,
    };
    this.contextValue = 'command';
  }
}

class StoreItem extends vscode.TreeItem {
  constructor(label, urlTemplate, icon, tooltip) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = tooltip || label;
    this.iconPath = new vscode.ThemeIcon(icon);
    this.command = {
      command: 'quickLinks.openStoreUrl',
      title: 'Open Store Link',
      arguments: [urlTemplate],
    };
    this.contextValue = 'storeLink';
  }
}

class CategoryItem extends vscode.TreeItem {
  constructor(label, icon) {
    super(label, vscode.TreeItemCollapsibleState.Expanded);
    this.tooltip = label;
    this.iconPath = new vscode.ThemeIcon(icon, new vscode.ThemeColor('textLink.activeForeground'));
    this.contextValue = 'category';
  }
}

// TreeDataProvider for quick links
class QuickLinksProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (!element) {
      const config = vscode.workspace.getConfiguration('shopifyQuickLinks');
      let storeHandle = config.get('storeHandle');

      if (!storeHandle) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        storeHandle = workspaceFolder ? workspaceFolder.name : 'not-set';
      }

      const categories = [
        new CategoryItem('Actions', 'rocket'),
        new CategoryItem(`Store: ${storeHandle}`, 'home'),
        new CategoryItem('Quick Links', 'star'),
        new CategoryItem('Documentation', 'book'),
      ];

      // Add custom categories from settings
      const customCategories = config.get('customCategories') || [];
      for (const cat of customCategories) {
        categories.push(new CategoryItem(cat.name, cat.icon || 'link'));
      }

      return categories;
    }

    // Check if this is Store category
    const isStoreCategory = element.label.startsWith('Store:');
    const categoryKey = isStoreCategory ? 'Store' : element.label;

    switch (categoryKey) {
      case 'Actions':
        return [
          new CommandItem('Shopify Theme Dev', 'quickLinks.shopifyDev', 'play', 'Start Shopify theme development server'),
          new CommandItem('Pull Theme JSON', 'quickLinks.shopifyPull', 'cloud-download', 'Pull theme JSON files only'),
          new CommandItem('Set Store Handle', 'quickLinks.setStoreHandle', 'edit', 'Configure your Shopify store handle')
        ];

      case 'Store':
        return [
          new StoreItem('Store Frontend', 'https://{storeHandle}.myshopify.com', 'globe', 'Open your Shopify store frontend'),
          new StoreItem('Store Admin', 'https://{storeHandle}.myshopify.com/admin', 'settings-gear', 'Open Shopify Admin Dashboard'),
          new StoreItem('Products', 'https://{storeHandle}.myshopify.com/admin/products', 'package', 'Manage store products'),
          new StoreItem('Themes', 'https://{storeHandle}.myshopify.com/admin/themes', 'paintcan', 'Manage store themes'),
        ];

      case 'Quick Links':
        return [
          new LinkItem('Shopify Community', 'https://community.shopify.com', 'comment-discussion', 'Shopify Community Forums'),
          new CommandItem('Open Git Repository', 'quickLinks.openGitRepo', 'github', 'Open remote git repository in browser'),
        ];

      case 'Documentation':
        const config = vscode.workspace.getConfiguration('shopifyQuickLinks');
        const customDocs = config.get('documentationLinks') || [];
        
        // Use custom documentation links if provided, otherwise use defaults
        if (customDocs.length > 0) {
          return customDocs.map(link => 
            new LinkItem(link.label, link.url, link.icon || 'book', link.tooltip || link.label)
          );
        }
        
        return [
          new LinkItem('Shopify CLI', 'https://shopify.dev/apps/tools/cli', 'terminal', 'Shopify Command Line Interface'),
          new LinkItem('GraphQL Admin API', 'https://shopify.dev/api/admin-graphql', 'database', 'Shopify Admin GraphQL API'),
          new LinkItem('Liquid Documentation', 'https://shopify.dev/api/liquid', 'code', 'Liquid Template Language'),
          new LinkItem('Theme Development', 'https://shopify.dev/themes', 'symbol-color', 'Shopify Theme Development'),
          new LinkItem('App Development', 'https://shopify.dev/apps', 'package', 'Shopify App Development'),
          new LinkItem('Storefront API', 'https://shopify.dev/api/storefront', 'globe', 'Shopify Storefront API')
        ];

      default:
        // Check if this is a custom category
        const config2 = vscode.workspace.getConfiguration('shopifyQuickLinks');
        const customCategories = config2.get('customCategories') || [];
        const customCat = customCategories.find(c => c.name === categoryKey);
        
        if (customCat && customCat.links) {
          return customCat.links.map(link =>
            new LinkItem(link.label, link.url, link.icon || 'link', link.tooltip || link.label)
          );
        }
        
        return [];
    }
  }
}

module.exports = QuickLinksProvider;
