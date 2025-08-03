import SwiftUI

struct SettingsView: View {
    @StateObject private var viewModel = SettingsViewModel()

    var body: some View {
        VStack(alignment: .leading) {
            Text("Settings")
                .font(.largeTitle)
                .padding(.bottom)

            // TODO: Add API Key Input (SecureField)
            HStack {
                Text("OpenRouter API Key:")
                TextField("Enter key", text: $viewModel.openRouterApiKey)
            }

            // TODO: Add Model Selection (Picker)
            HStack {
                Text("AI Model:")
                Picker("Model", selection: $viewModel.selectedModel) {
                    Text("Default Model").tag("Default Model")
                    // TODO: Populate with actual models
                }
            }

            Spacer()

            Button("Save Settings") {
                viewModel.saveSettings()
            }
        }
        .padding()
    }
}

#Preview {
    SettingsView()
}
