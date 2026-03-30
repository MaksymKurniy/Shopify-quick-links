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
  constructor(label, command, icon, tooltip) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = tooltip || label;
    this.iconPath = new vscode.ThemeIcon(icon);
    this.command = {
      command: 'quickLinks.runCommand',
      title: 'Run Command',
      arguments: [command],
    };
    this.contextValue = 'command';
  }
}

class TaskItem extends vscode.TreeItem {
  constructor(label, taskName, icon, tooltip) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = tooltip || label;
    this.iconPath = new vscode.ThemeIcon(icon);
    this.command = {
      command: 'quickLinks.runTask',
      title: 'Run Task',
      arguments: [taskName],
    };
    this.contextValue = 'task';
  }
}

class DynamicLinkItem extends vscode.TreeItem {
  constructor(label, urlTemplate, icon, tooltip) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = tooltip || label;
    this.iconPath = new vscode.ThemeIcon(icon);
    this.command = {
      command: 'quickLinks.openDynamicUrl',
      title: 'Open Dynamic Link',
      arguments: [urlTemplate],
    };
    this.contextValue = 'dynamicLink';
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
    this.getThemeId = null;
  }

  setThemeId(getThemeIdFn) {
    this.getThemeId = getThemeIdFn;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (!element) {
      // Get current handle for display
      const config = vscode.workspace.getConfiguration('shopifyQuickLinks');
      let storeHandle = config.get('storeHandle');

      if (!storeHandle) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        storeHandle = workspaceFolder ? workspaceFolder.name : 'not-set';
      }

      return [
        new CategoryItem('Actions', 'rocket'),
        new CategoryItem(`Store: ${storeHandle}`, 'home'),
        new CategoryItem('Quick Links', 'star'),
        new CategoryItem('Documentation', 'book'),
      ];
    }

    // Check if this is Store category
    const isStoreCategory = element.label.startsWith('Store:');
    const categoryKey = isStoreCategory ? 'Store' : element.label;

    switch (categoryKey) {
      case 'Actions':
        return [
          new CommandItem('Set Store Handle', 'quickLinks.setStoreHandle', 'edit', 'Configure your Shopify store handle'),
          new TaskItem('Shopify Theme Dev', 'Shopify: Theme Dev', 'play', 'Start Shopify theme development server'),
          new TaskItem('Pull Theme JSON', 'Shopify: Theme Pull (json only)', 'cloud-download', 'Pull theme JSON files only')
        ];

      case 'Store':
        const themeId = this.getThemeId ? this.getThemeId() : null;
        const frontendUrl = themeId 
          ? 'https://{storeHandle}.myshopify.com?preview_theme_id=' + themeId
          : 'https://{storeHandle}.myshopify.com';
        const frontendTooltip = themeId 
          ? 'Open store frontend with theme preview (theme: ' + themeId + ')'
          : 'Open your Shopify store frontend';
        const frontendIcon = themeId ? 'eye' : 'globe';
        
        return [
          new StoreItem('Store Frontend', frontendUrl, frontendIcon, frontendTooltip),
          new StoreItem('Store Admin', 'https://{storeHandle}.myshopify.com/admin', 'settings-gear', 'Open Shopify Admin Dashboard'),
          new StoreItem('Products', 'https://{storeHandle}.myshopify.com/admin/products', 'package', 'Manage store products'),
          new StoreItem('Themes', 'https://{storeHandle}.myshopify.com/admin/themes', 'paintcan', 'Manage store themes'),
        ];

      case 'Quick Links':
        return [
          new LinkItem('Shopify partners', 'https://partners.shopify.com/stores', 'shield', 'Shopify Partner Dashboard'),
          new LinkItem('Shopify Community', 'https://community.shopify.com', 'comment-discussion', 'Shopify Community Forums'),
          new DynamicLinkItem('Open Project on GitHub', 'https://github.com/{gitUser}/{workspaceName}', 'github-alt', 'Open current project on GitHub'),
        ];

      case 'Documentation':
        return [
          new LinkItem('Shopify CLI', 'https://shopify.dev/apps/tools/cli', 'terminal', 'Shopify Command Line Interface'),
          new LinkItem('GraphQL Admin API', 'https://shopify.dev/api/admin-graphql', 'database', 'Shopify Admin GraphQL API'),
          new LinkItem('Liquid Documentation', 'https://shopify.dev/api/liquid', 'code', 'Liquid Template Language'),
          new LinkItem('Theme Development', 'https://shopify.dev/themes', 'symbol-color', 'Shopify Theme Development'),
          new LinkItem('App Development', 'https://shopify.dev/apps', 'package', 'Shopify App Development'),
          new LinkItem('Storefront API', 'https://shopify.dev/api/storefront', 'globe', 'Shopify Storefront API')
        ];

      default:
        return [];
    }
  }
}

module.exports = QuickLinksProvider;
