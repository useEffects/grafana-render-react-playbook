import { readFileSync, watch } from "fs";
import { exit } from "process";
import debounce from "debounce";
import "dotenv/config"

const { API_KEY, ORG_ID, DASHBOARD_UID, PANEL_ID, HOSTNAME, FOLDER_UID, PROTOCOL } = process.env

const filePath = __dirname + "/source.tsx";

function getFileContents() {
    const fileContent = readFileSync(filePath, "utf8");
    const startComment = "// <- Start Here ->";
    const startIndex = fileContent.indexOf(startComment);
    if (startIndex === -1) {
        console.log("Could not find the start comment");
        exit();
    }
    const extractedContent = fileContent.substring(startIndex + startComment.length).trim();
    return extractedContent
}

async function postChanges() {
    const sourceCode = getFileContents()
    const response = await fetch(`https://${HOSTNAME}/api/dashboards/uid/${DASHBOARD_UID}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${API_KEY}`
        }
    })
    const result = await response.json()
    const { dashboard } = result
    dashboard.panels = result.dashboard.panels.map((panel: any) => {
        if (panel.id === parseInt(PANEL_ID!)) {
            return {
                ...panel,
                options: {
                    code: sourceCode
                }
            }
        }
        else return panel
    })
    const payload = {
        dashboard,
        message: `developer changes`,
        overwrite: true,
        folderUid: FOLDER_UID
    }
    const postResponse = await fetch(`${PROTOCOL}://${HOSTNAME}/api/dashboards/db`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    if (postResponse.status !== 200) {
        console.log(`status ${postResponse.status} ${postResponse.statusText}`)
    }
}

const debouncedPostChanges = debounce(postChanges, 500);

postChanges()
watch(filePath, (eventName) => {
    if (eventName === "change") {
        debouncedPostChanges();
    }
});