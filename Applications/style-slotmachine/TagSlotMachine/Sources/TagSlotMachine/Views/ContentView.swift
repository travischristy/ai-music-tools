import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            TagMachineView()
                .tabItem {
                    Label("Slot Machine", systemImage: "dice")
                }

            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
        }
    }
}

#Preview {
    ContentView()
}
