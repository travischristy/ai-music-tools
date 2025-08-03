import SwiftUI

class SettingsViewModel: ObservableObject {
    // Placeholder for state related to settings
    @Published var openRouterApiKey: String = ""
    @Published var selectedModel: String = "Default Model"

    // TODO: Implement loading/saving from UserDefaults/Keychain
    // TODO: Fetch available models from OpenRouter

    init() {
        // TODO: Load settings on init
    }

    func saveSettings() {
        // TODO: Save logic
        print("Settings saved (placeholder)")
    }
}
