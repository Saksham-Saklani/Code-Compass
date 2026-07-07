import type { GitHubTreeEntry } from "./github.js";

const ALLOWED_EXTENSIONS = [
    ".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".css", ".html", ".yml", ".yaml"
];

const IGNORED_DIRS = [
    "node_modules", "dist", "build", "coverage", ".git", ".github", ".vscode", ".next"
];

// only keep relevant code content files

export function filterFiles(tree: GitHubTreeEntry[]): GitHubTreeEntry[] {
    return tree.filter((entry) => {
        const isBlob = entry.type === "blob";
        const isNotIgnored = !IGNORED_DIRS.some(dir => entry.path.split("/").includes(dir));
        const hasAllowedExtension = ALLOWED_EXTENSIONS.some(ext => entry.path.endsWith(ext));

        return isBlob && isNotIgnored && hasAllowedExtension;
    });
}
