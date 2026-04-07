const vscode = require('vscode');
const QuickLinksProvider = require('./sidebarProvider');

// Helper functions
const getWorkspaceFolder = () => vscode.workspace.workspaceFolders?.[0];

const getStoreHandle = () => {
  const config = vscode.workspace.getConfiguration('shopifyQuickLinks');
  return config.get('storeHandle') || getWorkspaceFolder()?.name || null;
};

const runInTerminal = (name, command) => {
  const folder = getWorkspaceFolder();
  if (!folder) {
    vscode.window.showErrorMessage('No workspace folder is open');
    return;
  }
  
  // Close existing terminal with same name
  const existing = vscode.window.terminals.find(t => t.name === name);
  if (existing) {
    existing.dispose();
  }
  
  const terminal = vscode.window.createTerminal({ name, cwd: folder.uri.fsPath });
  terminal.show();
  terminal.sendText(command);
};

const gitSshToHttps = (url) => {
  if (url.startsWith('git@')) {
    return url.replace(/^git@([^:]+):/, 'https://$1/').replace(/\.git$/, '');
  }
  if (url.startsWith('ssh://')) {
    return url.replace(/^ssh:\/\/git@/, 'https://').replace(/\.git$/, '');
  }
  return url.replace(/\.git$/, '');
};

function activate(context) {
  const quickLinksProvider = new QuickLinksProvider();
  
  const treeView = vscode.window.createTreeView('quickLinksSidebar', {
    treeDataProvider: quickLinksProvider,
    showCollapseAll: true
  });

  // Auto-refresh on configuration change
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('shopifyQuickLinks')) {
        quickLinksProvider.refresh();
      }
    })
  );

  const commands = {
    'quickLinks.openUrl': (url) => vscode.env.openExternal(vscode.Uri.parse(url)),

    'quickLinks.openStoreUrl': (urlTemplate) => {
      const storeHandle = getStoreHandle();
      if (!storeHandle) {
        vscode.window.showErrorMessage('No store handle configured');
        return;
      }
      vscode.env.openExternal(vscode.Uri.parse(urlTemplate.replace('{storeHandle}', storeHandle)));
    },

    'quickLinks.openGitRepo': async () => {
      const folder = getWorkspaceFolder();
      if (!folder) {
        vscode.window.showErrorMessage('No workspace folder is open');
        return;
      }
      
      try {
        const gitConfig = await vscode.workspace.fs.readFile(
          vscode.Uri.joinPath(folder.uri, '.git', 'config')
        );
        const match = gitConfig.toString().match(/\[remote "origin"\][\s\S]*?url\s*=\s*(.+)/m);
        
        if (!match) {
          vscode.window.showErrorMessage('No git remote "origin" found');
          return;
        }
        
        vscode.env.openExternal(vscode.Uri.parse(gitSshToHttps(match[1].trim())));
      } catch {
        vscode.window.showErrorMessage('Not a git repository');
      }
    },

    'quickLinks.setStoreHandle': async () => {
      const config = vscode.workspace.getConfiguration('shopifyQuickLinks');
      const newHandle = await vscode.window.showInputBox({
        prompt: 'Enter your Shopify store handle',
        placeholder: 'my-awesome-store (without .myshopify.com)',
        value: config.get('storeHandle') || '',
        validateInput: (v) => v && !/^[a-zA-Z0-9-]+$/.test(v) ? 'Only letters, numbers, and hyphens allowed' : null
      });

      if (newHandle !== undefined) {
        await config.update('storeHandle', newHandle, vscode.ConfigurationTarget.Workspace);
        quickLinksProvider.refresh();
        vscode.window.showInformationMessage(newHandle ? `Store handle: ${newHandle}` : 'Using workspace name');
      }
    },

    'quickLinks.shopifyDev': () => {
      const storeHandle = getStoreHandle();
      if (!storeHandle) {
        vscode.window.showErrorMessage('No store handle configured');
        return;
      }
      runInTerminal('Shopify Dev', `shopify theme dev -s ${storeHandle}`);
    },

    'quickLinks.shopifyPull': () => runInTerminal('Shopify Pull', 'shopify theme pull -d -n -o "*.json"'),

    'quickLinks.refresh': () => quickLinksProvider.refresh()
  };

  context.subscriptions.push(
    treeView,
    ...Object.entries(commands).map(([id, handler]) => vscode.commands.registerCommand(id, handler))
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
