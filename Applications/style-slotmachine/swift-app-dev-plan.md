# **Blueprint: Tag Slot Machine macOS Application**

Version: 1.0  
Date: April 30, 2025

## **1\. Introduction**

### **1.1. Purpose**

This document outlines the functional and technical specifications for the "Tag Slot Machine" native macOS application. The application provides an interactive interface for generating combinations of descriptive music tags, potentially integrating with external APIs like MusicBrainz and OpenRouter, to assist users in crafting inputs for music creation or discovery.

### **1.2. Scope**

The application will be a standalone macOS desktop app featuring the "Tag Slot Machine" interface as its primary function. It will include mechanisms for configuring the machine, populating tag wheels from local data and/or external APIs, user interaction (manual selection, locking, shuffling), and outputting the generated tag combination. Integration with AI (OpenRouter) for suggestions and potential integration with MusicBrainz/Spotify for data sourcing are key aspects. A simple settings interface for API keys and preferences will be included.

### **1.3. Target Audience**

macOS users interested in music creation, discovery, or metadata tagging who desire an interactive tool for generating descriptive tag combinations.

## **2\. Architecture & Technology (Swift/SwiftUI Focus)**

### **2.1. Architecture Overview**

A standard macOS application architecture using Swift and SwiftUI:

* **App Entry Point (@main struct):** Initializes the application and sets up the main window scene.  
* **Main Content View (ContentView.swift):** The root view containing the primary UI, potentially a TabView for different sections (Tag Machine, Settings).  
* **View Models (ObservableObject classes):** Handle the state, data fetching logic, and business logic for specific views (e.g., TagMachineViewModel, SettingsViewModel). Views observe these models for updates.  
* **Views (struct conforming to View):** Define the UI components (e.g., TagMachineView.swift, SlotWheelView.swift, SettingsView.swift) using SwiftUI declarative syntax.  
* **Data Fetcher (DataFetcher.swift or similar):** A class or set of functions responsible for interacting with external APIs (MusicBrainz, OpenRouter, Spotify) and parsing responses. Uses Swift's URLSession for network requests and Codable for JSON parsing.  
* **Configuration Manager (ConfigurationManager.swift or similar):** Handles loading and saving user settings and API keys using UserDefaults and the macOS Keychain.  
* **Local Data (\*.json files):** Packaged within the app bundle as resources, providing fallback tag data.

### **2.2. Key Technologies & Frameworks**

* **Language:** Swift 5.x  
* **UI Framework:** SwiftUI (Recommended for modern macOS development) or AppKit (Alternative for more traditional UI control).  
* **Networking:** URLSession (Built-in Swift framework for HTTP requests).  
* **JSON Parsing:** Codable protocol (Built-in Swift).  
* **Data Persistence:**  
  * UserDefaults (For non-sensitive settings like selected AI model, wheel configurations).  
  * Keychain Services (Security framework) (For securely storing sensitive API keys like OpenRouter, Spotify).  
* **Package Management:** Swift Package Manager (SPM).  


## **3\. Core Feature: Tag Slot Machine**

### **3.1. UI Implementation (SwiftUI)**

* **Main View (TagMachineView.swift):**  
  * Contains sections for Configuration Controls, the Slot Machine Container, Shuffle Button, and Output Area.  
  * Uses layout containers like VStack, HStack, Grid.  
* **Configuration Controls:**  
  * SwiftUI controls like Picker (for dropdowns/segmented controls), Toggle (for checkboxes), Stepper or Picker (for wheel counts).  
  * Bind control values to properties in the TagMachineViewModel using @State or @ObservedObject.  
* **Slot Machine Container:**  
  * A ScrollView(.horizontal) containing an HStack to hold the wheel columns.  
  * Use ForEach loops driven by data in the TagMachineViewModel to dynamically generate wheel columns and wheels.  
* **Wheel Column (WheelColumnView.swift \- if needed):** A VStack to hold multiple SlotWheelView instances when stacking is required.  
* **Slot Wheel (SlotWheelView.swift):**  
  * Custom View struct.  
  * Text for the title.  
  * A ScrollView containing a LazyVStack or List to display the scrollable tag items (.wheel-content). Apply .frame(height: ...) to set the visible height. Add visual effects (borders, backgrounds, potentially rotation3DEffect for subtle cylinder).  
  * Button for each tag item (.wheel-item), styled appropriately with hover/selected states managed via @State within the wheel or passed bindings.  
  * Button for Lock/Unlock, changing appearance based on a bound state variable.  
* **State Management:** The TagMachineViewModel holds the configuration settings, the list of active wheels, the data for each wheel, the selected tag for each wheel, and the lock state for each wheel. Changes in the UI update the ViewModel, and changes in the ViewModel automatically update the UI via SwiftUI's data binding.  
* **Data Population:** The TagMachineViewModel triggers calls to the DataFetcher to get tag lists (from JSON or APIs) based on the configuration. Results are published (e.g., using @Published properties) for the views to display.

### **3.2. Data Sources & Fetching (DataFetcher.swift)**

* **Local JSON:**  
  * Include database/tagbuilder/\*.json files in the app bundle resources.  
  * Create functions to load and parse these files using Bundle.main.url(forResource:withExtension:) and JSONDecoder.  
* **MusicBrainz API:**  
  * Implement functions using URLSession to call MusicBrainz API endpoints (e.g., /ws/2/instrument, /ws/2/tag, /ws/2/artist).  
  * Construct URLs according to MusicBrainz API docs. Set the required User-Agent header.  
  * Parse XML or JSON responses using XMLParser or JSONDecoder with appropriate Codable structs.  
  * **Specific Categories:**  
    * **Instruments:** Use /instrument search or relationship includes.  
    * **Genres/Moods/Productions/Vocals:** Primarily use /tag search or parse tags included with artist/release lookups.  
    * **Periods:** Parse dates from entity lookups or use tags.  
  * **Caching:** Implement simple caching (e.g., in-memory dictionary or writing to disk) to reduce API calls.  
* **OpenRouter API:**  
  * Implement functions using URLSession to call /chat/completions (POST) and /models (GET).  
  * Handle Authorization: Bearer header using the key retrieved from Keychain.  
  * Include HTTP-Referer.  
  * Parse JSON responses using Codable structs.  
* **Spotify API (Optional):**  
  * Implement OAuth 2.0 flow using AuthenticationServices framework (ASWebAuthenticationSession) for user login.  
  * Securely store refresh/access tokens in Keychain.  
  * Use URLSession to call Spotify API endpoints (e.g., /recommendations/available-genre-seeds, /audio-features). Handle token refresh.

### **3.3. Interaction Logic (TagMachineViewModel.swift)**

* **Configuration Changes:** Methods triggered by UI controls update @Published properties for wheel counts/types, which then triggers updateWheels().  
* **updateWheels():** Rebuilds the data structure representing the active wheels based on current configuration. SwiftUI's ForEach automatically updates the UI. Fetches necessary data via DataFetcher.  
* **selectTag(wheelIndex: Int, tag: String):** Updates the selected tag for the specified wheel, optionally sets its lock state to true.  
* **toggleLock(wheelIndex: Int):** Flips the lock state for the specified wheel.  
* **shuffleUnlockedWheels():** Iterates through the wheel data structure. For unlocked wheels, selects a random tag from its data source and calls selectTag (with autoLock=false).  
* **generateOutputString():** Computed property or method that iterates through the selected tags for all active wheels and creates the comma-separated output string.

## **4\. Other Features**

### **4.1. Song Studio (Simplified Scope)**

* **UI (SongStudioView.swift):** A separate tab. Simpler layout compared to Tag Machine.  
  * TextEditor for lyrics.  
  * TextField for AI prompt.  
  * Buttons for "Generate", "Continue".  
  * Picker for Structure (load from songstudio/structures.json).  
  * TextFields for Tempo, Mood.  
  * Text view for output.  
  * "Copy" button.  
* **Logic (SongStudioViewModel.swift):** Holds text field values, triggers OpenRouter calls via DataFetcher for AI features, formats output.

### **4.2. Settings**

* **UI (SettingsView.swift):** Separate tab.  
  * SecureField for OpenRouter API Key.  
  * Picker for AI Model selection (populated by DataFetcher).  
  * "Save Settings" button.  
  * (Optional) Section for Spotify login/logout button if implemented.  
* **Logic (SettingsViewModel.swift, ConfigurationManager.swift):**  
  * Loads current settings from UserDefaults and Keychain on view appear.  
  * Populates model list dropdown by calling DataFetcher.  
  * Saves API Key to Keychain and other settings to UserDefaults when "Save" is clicked.

## **5\. Data Persistence**

* **API Keys (OpenRouter, Spotify):** Store securely in the macOS Keychain using the Security framework. Create helper functions in ConfigurationManager to add, retrieve, and delete keychain items.  
* **Non-Sensitive Settings (Selected AI Model, Last Wheel Config):** Store in UserDefaults.standard.

## **6\. Development Environment & Build**

* **IDE:** Xcode is strongly recommended for its SwiftUI previews, build system, debugging, and code signing integration. VS Code with Swift extensions is an alternative requiring manual configuration of build tasks (using swift build).  
* **Dependencies:** Manage external libraries (if any, like a Spotify client library) using Swift Package Manager (integrated into Xcode and usable from CLI).  
* **Build:** Use Xcode's "Build" or "Archive" commands, or swift build \-c release from the command line.  
* **Output:** A self-contained .app bundle in the build products directory.

## **7\. Distribution**

* **Direct Distribution:** Zip the .app bundle and share it directly. Users may need to bypass Gatekeeper security warnings.  
* **Code Signing & Notarization:** Obtain an Apple Developer ID certificate. Sign the app during the build process (configured in Xcode). Submit the signed app to Apple for notarization. This allows users to run the app without security warnings.  
* **Mac App Store (Optional):** Requires enrolling in the Apple Developer Program, adhering to App Store guidelines, and submitting through App Store Connect.

## **8\. Future Enhancements**

* Implement Spotify API integration.  
* Add more sophisticated AI features.  
* Allow user customization of local JSON tag lists.  
* Save/Load specific slot machine configurations as presets.  
* Add more visual flair and animation to the wheels.