import SwiftUI

struct SlotWheelView: View {
    // Use @Binding if the ViewModel needs to be notified of changes directly from here
    // Or pass callback closures for actions like selecting/locking
    let wheel: SlotWheel 
    let onSelectTag: (String) -> Void // Closure to call when a tag is selected
    let onToggleLock: () -> Void     // Closure to call when lock is toggled

    var body: some View {
        VStack(alignment: .leading) {
            HStack {
                Text(wheel.category.rawValue.capitalized)
                    .font(.headline)
                Spacer()
                Button {
                    onToggleLock()
                } label: {
                    Image(systemName: wheel.isLocked ? "lock.fill" : "lock.open")
                }
                .buttonStyle(.plain) // Use plain style for better integration
            }

            // Scrollable list of tags
            ScrollViewReader { scrollProxy in // To scroll to selected tag
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 2) { // Use LazyVStack for performance
                        ForEach(wheel.availableTags, id: \.self) { tag in
                            Text(tag)
                                .padding(.horizontal, 4)
                                .padding(.vertical, 2)
                                .frame(maxWidth: .infinity, alignment: .leading) // Make text take full width
                                .background(tag == wheel.selectedTag ? Color.accentColor.opacity(0.3) : Color.clear) // Highlight selected
                                .cornerRadius(4)
                                .id(tag) // ID for ScrollViewReader
                                .onTapGesture {
                                    onSelectTag(tag)
                                }
                        }
                    }
                }
                .frame(height: 150) // Fixed height for the scrollable area
                .border(Color.gray.opacity(0.5))
                .onChange(of: wheel.selectedTag) { _, newValue in
                     // Scroll to the newly selected tag
                     if let tag = newValue {
                         withAnimation {
                            scrollProxy.scrollTo(tag, anchor: .center)
                         }
                     }
                }
                .onAppear {
                    // Scroll to the initial selected tag
                     if let tag = wheel.selectedTag {
                         scrollProxy.scrollTo(tag, anchor: .center)
                     }
                }
            }
        }
        .padding(5)
        .background(Color.secondary.opacity(0.1)) // Slight background for the wheel Vstack
        .cornerRadius(8)
    }
}

// #Preview { 
//     // Need to create a sample SlotWheel and dummy closures for preview
//     let sampleWheel = SlotWheel(
//         category: .genres, 
//         availableTags: ["Rock", "Pop", "Jazz", "Classical", "Electronic", "Hip Hop"], 
//         selectedTag: "Jazz", 
//         isLocked: false
//     )
//     SlotWheelView(wheel: sampleWheel, onSelectTag: { tag in print("Selected: \(tag)") }, onToggleLock: { print("Lock toggled") })
//         .padding()
// }
