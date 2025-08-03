import SwiftUI

struct TagMachineView: View {
    @StateObject private var viewModel = TagMachineViewModel()

    var body: some View {
        VStack {
            Text("Tag Slot Machine")
                .font(.largeTitle)
                .padding(.bottom)

            // --- Configuration Controls ---
            VStack(alignment: .leading) {
                Stepper("Genre Wheels: \(viewModel.genreWheelCount)", value: $viewModel.genreWheelCount, in: 1...3) // Limit genres 1-3
                Toggle("Vocal Wheel", isOn: $viewModel.vocalWheelEnabled)
                
                // Optional Categories
                // Use DisclosureGroup or similar for better organization if many categories
                ForEach($viewModel.optionalCategoryConfigs) { $config in
                    HStack {
                        Toggle(config.category.rawValue.capitalized, isOn: $config.isEnabled)
                        if config.isEnabled {
                            Stepper("Count: \(config.numberOfWheels)", value: $config.numberOfWheels, in: 1...3) // Limit 1-3
                        }
                    }
                }
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(8)
            .padding(.bottom)

            // Slot Machine Wheels Container
            ScrollView(.horizontal, showsIndicators: true) {
                HStack(spacing: 10) { 
                    ForEach(viewModel.activeWheels) { wheel in
                        SlotWheelView(
                            wheel: wheel,
                            onSelectTag: { selectedTag in
                                viewModel.selectTag(wheelId: wheel.id, tag: selectedTag)
                            },
                            onToggleLock: { 
                                viewModel.toggleLock(wheelId: wheel.id)
                            }
                        )
                        .frame(width: 180) 
                    }
                }
                .padding(.horizontal) 
            }
            .frame(height: 220) 
            .border(Color.gray.opacity(0.3))
            .padding(.bottom)

            // --- Controls & Output ---
            HStack {
                 Button("Shuffle Unlocked") {
                     viewModel.shuffleUnlockedWheels()
                 }
                 .padding()
                 
                 Spacer()
                 
                 Button("Copy Tags") {
                     copyTagsToClipboard()
                 }
                 .padding()
             }

            // Output Area
            TextEditor(text: .constant(viewModel.generatedTags)) 
                .frame(height: 80)
                .border(Color.gray.opacity(0.5))
                .font(.body)
                .padding(.horizontal)
        }
        .padding()
    }
    
    private func copyTagsToClipboard() {
        #if os(macOS)
        let pasteboard = NSPasteboard.general
        pasteboard.clearContents()
        pasteboard.setString(viewModel.generatedTags, forType: .string)
        print("Tags copied to clipboard: \(viewModel.generatedTags)")
        #else
        // iOS clipboard implementation if needed later
        // UIPasteboard.general.string = viewModel.generatedTags
        #endif
    }
}

#Preview {
    TagMachineView()
}
