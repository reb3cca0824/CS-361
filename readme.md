# CS-361 Tab Organizer Chrome Extension

A lightweight Manifest V3 Chrome extension that helps you group, name, and close browser tabs by topic. perfect for keeping your research or workflows organized.

---

## 🔍 Features

* **Auto-Group by Site**: Scans all open tabs, buckets them by hostname (e.g., `github.com`, `wikipedia.org`), and creates a Chrome Tab Group for each.
* **Create & Name Custom Groups**: In the popup UI, enter a name to carve out an empty group you can populate and label however you like.
* **Close All Tabs in a Group**:

  * Via Popup: click **Close** next to a group.
  * Via Context Menu: right-click a tab → **Close all tabs in this group**.

---

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/reb3cca0824/CS-361.git
   ```
2. **Navigate to the extension folder**:

   ```bash
   cd CS-361/extension
   ```
3. **Open Chrome’s Extensions page**:

  * Go to `chrome://extensions` or click the ⋮ menu → **More Tools** → **Extensions**.
4. **Enable Developer mode**:

  * Toggle the switch in the top-right corner.
5. **Load unpacked extension**:

  * Click **Load unpacked**, then select the `extension/` directory.
6. **Verify installation**:

  * You should see **CS-361 Tab Organizer** listed and its icon in the toolbar.

---

## ⚙️ Usage

1. **Auto-Group by Site**

  * Click the toolbar icon → **Auto-Group by Site**.
  * Tabs cluster into groups named by hostname.

2. **Create Named Group**

  * Click the toolbar icon.
  * Enter a custom group name and click **Create Named Group**.
  * Drag tabs into the new group.

3. **Close a Group**

  * **Popup**: click **Close** next to any group.
  * **Context Menu**: right-click a tab → **Close all tabs in this group**.

---

## 📁 Folder Structure

```
extension/
├── icons/
│   ├── icon16.png      # 16×16 toolbar icon
│   ├── icon48.png      # 48×48 hover icon
│   └── icon128.png     # 128×128 on the Extensions page
├── background.js       # Service worker: grouping & context-menu logic
├── manifest.json       # Chrome Manifest V3
├── popup.html          # Popup UI
└── popup.js            # Popup logic & messaging
```

---

## 🛠 Development & Testing

* **Reload Extension**: go to `chrome://extensions` → click **Reload** under **CS-361 Tab Organizer**.
* **Debug**: right-click the popup → **Inspect** to open DevTools and view `console.log()` output.
* **Storage**: named-group titles persist in `chrome.storage.local` (inspect via DevTools → Application → Local Storage).

---

## 🤝 Contributing

1. **Fork** the repository.
2. **Create a feature branch**:

   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Commit your changes**:

   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to your branch**:

   ```bash
   git push origin feature/YourFeature
   ```
5. **Open a Pull Request** on GitHub.

Please follow the existing code style and include appropriate tests and documentation for any new features.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
