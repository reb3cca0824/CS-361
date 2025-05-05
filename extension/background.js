//
// 1) Context-menu for “Close all tabs in this group”
//
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "close-group",
        title: "Close all tabs in this group",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "close-group" && tab.groupId > -1) {
        chrome.tabs.query({ groupId: tab.groupId }, tabs =>
            chrome.tabs.remove(tabs.map(t => t.id))
        );
    }
});

//
// 2) Message handler for all popup commands
//
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {

    // A) Auto-group by host, stripping “www.” and “.com”
    if (msg.action === "autoGroupByHost") {
        // 1. Query all tabs
        const allTabs = await chrome.tabs.query({});

        // 2. Bucket by sanitized hostname
        const byHost = allTabs.reduce((map, tab) => {
            try {
                let host = new URL(tab.url).hostname.toLowerCase();
                host = host.replace(/^www\./, "").replace(/\.com$/, "");
                (map[host] = map[host] || []).push(tab.id);
            } catch (e) { /* ignore invalid URLs */ }
            return map;
        }, {});

        // 3. Group & label each bucket
        for (const [label, ids] of Object.entries(byHost)) {
            const groupId = await chrome.tabs.group({ tabIds: ids });
            await chrome.tabGroups.update(groupId, { title: label });
        }

        return sendResponse({ done: true });
    }

    // B) List existing groups for the popup
    if (msg.action === "listGroups") {
        const groups = await chrome.tabGroups.query({});
        const stored = (await chrome.storage.local.get("namedGroups")).namedGroups || [];
        const resp = groups.map(g => {
            const custom = stored.find(s => s.id === g.id);
            return {
                id:    g.id,
                title: custom?.name || g.title,
                count: g.tabCount
            };
        });
        return sendResponse({ groups: resp });
    }

    // C) Create & name a new group (opens a blank tab, groups it, renames it)
    if (msg.action === "createNamedGroup") {
        try {
            const newTab = await chrome.tabs.create({ active: true });
            const groupId = await chrome.tabs.group({ tabIds: [ newTab.id ] });
            await chrome.tabGroups.update(groupId, {
                title: msg.name,
                color: "blue"
            });
            const store       = await chrome.storage.local.get("namedGroups");
            const namedGroups = store.namedGroups || [];
            namedGroups.push({ id: groupId, name: msg.name });
            await chrome.storage.local.set({ namedGroups });
            return sendResponse({ success: true, groupId });
        } catch (err) {
            console.error("createNamedGroup failed:", err);
            return sendResponse({ success: false, error: err.message });
        }
    }

    // Tell Chrome we’ll call sendResponse asynchronously
    return true;
});
