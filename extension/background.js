// Create a context-menu item to close the group of the right-clicked tab
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "close-group",
        title: "Close all tabs in this group",
        contexts: ["all"]
    });
});

// Handle the context-menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "close-group" && tab.groupId > -1) {
        // get all tabs in that group
        let tabs = await chrome.tabs.query({ groupId: tab.groupId });
        let ids = tabs.map(t => t.id);
        chrome.tabs.remove(ids);
    }
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(async (msg, sender, respond) => {
    if (msg.action === "autoGroupByHost") {
        // group tabs by hostname
        let all = await chrome.tabs.query({});
        let byHost = all.reduce((m, t) => {
            try {
                let host = new URL(t.url).hostname;
                (m[host] = m[host]||[]).push(t.id);
            } catch(e){}
            return m;
        }, {});
        // for each host, group its tabs
        for (let [host, ids] of Object.entries(byHost)) {
            let groupId = await chrome.tabs.group({ tabIds: ids });
            await chrome.tabGroups.update(groupId, { title: host });
        }
        respond({done:true});
    }

    if (msg.action === "createNamedGroup") {
        // create an empty group and store its name
        let { name } = msg;
        let groupId = await chrome.tabs.group({ tabIds: [] });
        await chrome.tabGroups.update(groupId, { title: name, color: "blue" });
        // persist the name
        let groups = (await chrome.storage.local.get("namedGroups")).namedGroups || [];
        groups.push({ id: groupId, name });
        await chrome.storage.local.set({ namedGroups: groups });
        respond({groupId});
    }

    if (msg.action === "listGroups") {
        let groups = await chrome.tabGroups.query({});
        let stored = (await chrome.storage.local.get("namedGroups")).namedGroups || [];
        // merge storage names
        let out = groups.map(g => {
            let storedName = (stored.find(s=>s.id===g.id)||{}).name;
            return { id: g.id, title: storedName || g.title, count: g.tabCount };
        });
        respond({groups: out});
    }

    return true; // will respond asynchronously
});
