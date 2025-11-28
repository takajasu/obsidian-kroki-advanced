import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface KrokiAdvancedSettings {
	kroki_service_url: string;
	cache_settings: {
		enabled: boolean;
		expiration_days: number;
	}
}

const DEFAULT_SETTINGS: KrokiAdvancedSettings = {
	kroki_service_url: 'https://kroki.io/',
	cache_settings: {
		enabled: true,
		expiration_days: 30
	}
}

export default class KrokiAdvancedPlugin extends Plugin {
	settings: KrokiAdvancedSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new KrokiAdvancedSettingTab(this.app, this));

	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class KrokiAdvancedSettingTab extends PluginSettingTab {
	plugin: KrokiAdvancedPlugin;

	constructor(app: App, plugin: KrokiAdvancedPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Kroki Service URL')
			.setDesc('URL of the Kroki service')
			.addText(text => text
				.setPlaceholder('Enter the Kroki service URL')
				.setValue(this.plugin.settings.kroki_service_url)
				.onChange(async (value) => {
					this.plugin.settings.kroki_service_url = value;
					await this.plugin.saveSettings();
				}));
	}
}
