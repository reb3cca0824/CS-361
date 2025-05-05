document.addEventListener('DOMContentLoaded', () => {
    const autoBtn   = document.getElementById("auto");
    const createBtn = document.getElementById("create");
    const nameInput = document.getElementById("groupName");
    const groupsDiv = document.getElementById("groups");

    // Refresh and render the group list
    async function refreshGroups() {
        chrome.runtime.sendMessage({ action: "listGroups" }, resp => {
            groupsDiv.innerHTML = "";
            resp.groups.forEach(g => {
                const div      = document.createElement("div");
                div.className  = "group";
                const span     = document.createElement("span");
                span.textContent = `${g.title} (${g.count} tabs)`;
                const closeBtn = document.createElement("button");
                closeBtn.textContent = "Close";
                closeBtn.style.width = "60px";
                closeBtn.onclick = () => {
                    chrome.tabs.query({ groupId: g.id }, tabs =>
                        chrome.tabs.remove(tabs.map(t => t.id), refreshGroups)
                    );
                };
                div.append(span, closeBtn);
                groupsDiv.append(div);
            });
        });
    }

    // Auto-group click
    autoBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "autoGroupByHost" }, refreshGroups);
    });

    // Create named group click
    createBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (!name) return alert("Enter a name first");
        chrome.runtime.sendMessage({ action: "createNamedGroup", name }, () => {
            nameInput.value = "";
            refreshGroups();
        });
    });

    // Initial load
    refreshGroups();
});
