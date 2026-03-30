const vscode = require('vscode');
const QuickLinksProvider = require('./sidebarProvider');

function activate(context) {
  const quickLinksProvider = new QuickLinksProvider();
  
  // Global variable for theme ID
  let currentThemeId = null;
  
  // Register TreeView
  const treeView = vscode.window.createTreeView('quickLinksSidebar', {
    treeDataProvider: quickLinksProvider,
    showCollapseAll: true
  });
  
  // Command for opening URLs
  const openUrlCommand = vscode.commands.registerCommand('quickLinks.openUrl', (url) => {
    vscode.env.openExternal(vscode.Uri.parse(url));
  });
  
  // Command for store links
  const openStoreUrlCommand = vscode.commands.registerCommand('quickLinks.openStoreUrl', async (urlTemplate) => {
    const config = vscode.workspace.getConfiguration('shopifyQuickLinks');
    let storeHandle = config.get('storeHandle');
    
    // If handle is not set, use workspace name
    if (!storeHandle) {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (workspaceFolder) {
        storeHandle = workspaceFolder.name;
      } else {
        vscode.window.showErrorMessage('No store handle configured and no workspace folder open');
        return;
      }
    }
    
    const storeUrl = urlTemplate.replace('{storeHandle}', storeHandle);
    vscode.env.openExternal(vscode.Uri.parse(storeUrl));
  });
  
  // Command for dynamic links
  const openDynamicUrlCommand = vscode.commands.registerCommand('quickLinks.openDynamicUrl', async (urlTemplate) => {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No workspace folder is open');
      return;
    }
    
    const workspaceName = workspaceFolder.name;
    let gitUser = 'your-username'; // fallback
    
    // Try to get Git user from git config
    try {
      const gitConfig = await vscode.workspace.fs.readFile(
        vscode.Uri.joinPath(workspaceFolder.uri, '.git', 'config')
      );
      const configText = gitConfig.toString();
      const originMatch = configText.match(/url = .*github\.com[:/](.+?)\//);
      if (originMatch) {
        gitUser = originMatch[1];
      }
    } catch (error) {
      // If failed to read git config, use fallback
    }
    
    const dynamicUrl = urlTemplate
      .replace('{workspaceName}', workspaceName)
      .replace('{gitUser}', gitUser)
      .replace('{workspaceBasename}', workspaceName);
    
    vscode.env.openExternal(vscode.Uri.parse(dynamicUrl));
  });

  // Command for setting store handle
  const setStoreHandleCommand = vscode.commands.registerCommand('quickLinks.setStoreHandle', async () => {
    const config = vscode.workspace.getConfiguration('shopifyQuickLinks');
    const currentHandle = config.get('storeHandle') || '';
    
    const newHandle = await vscode.window.showInputBox({
      prompt: 'Enter your Shopify store handle',
      placeholder: 'my-awesome-store (without .myshopify.com)',
      value: currentHandle,
      validateInput: (value) => {
        if (value && !/^[a-zA-Z0-9-]+$/.test(value)) {
          return 'Store handle can only contain letters, numbers, and hyphens';
        }
        return null;
      }
    });
    
    if (newHandle !== undefined) {
      await config.update('storeHandle', newHandle, vscode.ConfigurationTarget.Workspace);
      quickLinksProvider.refresh();
      
      if (newHandle) {
        vscode.window.showInformationMessage(`Store handle set to: ${newHandle}`);
      } else {
        vscode.window.showInformationMessage('Store handle cleared - will use workspace name');
      }
    }
  });
  
  // Command for running VS Code commands
  const runCommandCommand = vscode.commands.registerCommand('quickLinks.runCommand', (commandId) => {
    vscode.commands.executeCommand(commandId);
  });
  
  // Command for running tasks with Theme Dev handling
  const runTaskCommand = vscode.commands.registerCommand('quickLinks.runTask', async (taskName) => {
    const tasks = await vscode.tasks.fetchTasks();
    const task = tasks.find(t => t.name === taskName);
    
    if (task) {
      vscode.tasks.executeTask(task);
    } else {
      vscode.window.showErrorMessage(`Task "${taskName}" not found`);
    }
  });
  
  // Команда для оновлення дерева
  const refreshCommand = vscode.commands.registerCommand('quickLinks.refresh', () => {
    quickLinksProvider.refresh();
  });
  
  // Pass currentThemeId to quickLinksProvider
  quickLinksProvider.setThemeId(() => currentThemeId);

  context.subscriptions.push(
    treeView, 
    openUrlCommand, 
    openStoreUrlCommand,
    openDynamicUrlCommand, 
    runCommandCommand, 
    runTaskCommand, 
    setStoreHandleCommand,
    refreshCommand
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
