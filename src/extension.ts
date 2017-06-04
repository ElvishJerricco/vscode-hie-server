'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

import * as path from 'path';

import { workspace, Disposable, ExtensionContext, languages } from 'vscode';
import { LanguageClient, LanguageClientOptions,
	     Executable, ExecutableOptions,
         SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';

// --------------------------------------------------------------------
// Example from https://github.com/Microsoft/vscode/issues/2059
const fixProvider = {
    provideCodeActions: function(document, range, context, token) {
        return [{ title: "Command", command: "cursorUp" }];
    }
};

// --------------------------------------------------------------------

export function activate(context: ExtensionContext) {
    // const fixer = languages.registerCodeActionsProvider("haskell", fixProvider);
    // context.subscriptions.push(fixer);

	// The server is implemented in node
	//let serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
	let serverPath = context.asAbsolutePath(path.join('.', 'hie-vscode.sh'));
	// The debug options for the server
	let debugOptions = { execArgv: ["--nolazy", "--debug=6004"] };
	
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = { command: "nix-shell", args: ["--pure", "--run", serverPath], options: { cwd: workspace.rootPath } }
	
	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: ['haskell'],
		synchronize: {
			// Synchronize the setting section 'languageServerHaskell' to the server
			configurationSection: 'languageServerHaskell',
			// Notify the server about file changes to '.clientrc files contain in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	}
	
	// Create the language client and start the client.
	let disposable = new LanguageClient('Language Server Haskell', serverOptions, clientOptions).start();
	
	// Push the disposable to the context's subscriptions so that the 
	// client can be deactivated on extension deactivation
	context.subscriptions.push(disposable);
}
