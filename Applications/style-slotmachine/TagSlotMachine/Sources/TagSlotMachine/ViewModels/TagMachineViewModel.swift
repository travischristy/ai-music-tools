import SwiftUI

// Structure to represent a single slot machine wheel's state
struct SlotWheel: Identifiable {
    let id = UUID() // For ForEach loops
    let category: TagCategory
    var availableTags: [String]
    var selectedTag: String? // nil if no tag selected yet
    var isLocked: Bool = false
}

// Structure to hold configuration for a category of wheels
struct WheelCategoryConfig {
    let category: TagCategory
    var numberOfWheels: Int
    var isEnabled: Bool // For optional categories
}

class TagMachineViewModel: ObservableObject {
    private let dataFetcher = DataFetcher()

    // --- Configuration State ---
    // TODO: Make these configurable via UI
    @Published var genreWheelCount: Int = 1 {
        didSet { updateWheels() }
    }
    @Published var vocalWheelEnabled: Bool = true {
        didSet { updateWheels() }
    }
    @Published var optionalCategoryConfigs: [WheelCategoryConfig] = [
        WheelCategoryConfig(category: .periods, numberOfWheels: 1, isEnabled: false),
        WheelCategoryConfig(category: .instruments, numberOfWheels: 1, isEnabled: false),
        WheelCategoryConfig(category: .emotions, numberOfWheels: 1, isEnabled: false),
        WheelCategoryConfig(category: .productions, numberOfWheels: 1, isEnabled: false)
        // Add other optional categories here
    ] {
        didSet { updateWheels() }
    }

    // --- Wheel State ---
    @Published var activeWheels: [SlotWheel] = []

    // --- Output State ---
    @Published var generatedTags: String = ""

    init() {
        updateWheels() // Initialize wheels based on default config
        // No longer need explicit observation setup here if using didSet
        // updateGeneratedTagsString() // updateWheels() already calls this
    }

    // Rebuilds the activeWheels array based on the current configuration
    func updateWheels() {
        var newWheels: [SlotWheel] = []

        // Add Genre wheels
        for _ in 0..<genreWheelCount {
            let tags = dataFetcher.loadTags(from: .genres)
            newWheels.append(SlotWheel(category: .genres, availableTags: tags, selectedTag: tags.randomElement()))
        }

        // Add Vocal wheel
        if vocalWheelEnabled {
            let tags = dataFetcher.loadTags(from: .vocals)
            newWheels.append(SlotWheel(category: .vocals, availableTags: tags, selectedTag: tags.randomElement()))
        }

        // Add Optional category wheels
        for config in optionalCategoryConfigs where config.isEnabled {
            for _ in 0..<config.numberOfWheels {
                let tags = dataFetcher.loadTags(from: config.category)
                newWheels.append(SlotWheel(category: config.category, availableTags: tags, selectedTag: tags.randomElement()))
            }
        }

        activeWheels = newWheels
        updateGeneratedTagsString() // Update output whenever wheels change
        print("Updated wheels. Count: \(activeWheels.count)")
    }

    // Updates the comma-separated output string
    func updateGeneratedTagsString() {
        generatedTags = activeWheels
            .compactMap { $0.selectedTag } // Get selected tags, ignore nil
            .joined(separator: ", ")
    }

    // Selects a tag for a specific wheel
    func selectTag(wheelId: UUID, tag: String) {
        if let index = activeWheels.firstIndex(where: { $0.id == wheelId }) {
            activeWheels[index].selectedTag = tag
            // Optionally auto-lock on manual selection? Design decision.
            // activeWheels[index].isLocked = true 
            updateGeneratedTagsString()
            print("Selected tag '\(tag)' for wheel \(index)")
        }
    }

    // Toggles the lock state for a specific wheel
    func toggleLock(wheelId: UUID) {
        if let index = activeWheels.firstIndex(where: { $0.id == wheelId }) {
            activeWheels[index].isLocked.toggle()
            print("Toggled lock for wheel \(index) to \(activeWheels[index].isLocked)")
        }
    }

    // Shuffles the tags for all wheels that are not locked
    func shuffleUnlockedWheels() {
        print("Shuffling unlocked wheels...")
        var didShuffle = false
        for index in activeWheels.indices {
            if !activeWheels[index].isLocked {
                // Select a new random tag (ensure it's different if possible, but simple random for now)
                if let newTag = activeWheels[index].availableTags.randomElement() {
                    activeWheels[index].selectedTag = newTag
                    didShuffle = true
                    print("  - Shuffled wheel \(index) to '\(newTag)'")
                } else {
                    print("  - Could not shuffle wheel \(index) - no tags available?")
                }
            }
        }
        
        if didShuffle {
            updateGeneratedTagsString()
        }
    }

    // TODO: Add methods for configuration changes reacting to UI (e.g., changeGenreCount)
}
