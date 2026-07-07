
import { URL } from "url";
import { Octokit} from "@octokit/core"

const octokit = new Octokit()

interface RepoInfo{
    owner: string,
    repoName: string
}

export type GitHubTreeEntry = {
    path: string;
    sha: string;
    type: "blob" | "tree";
};

// extract repo info from github repo url

function extractRepoInfo(url: string):RepoInfo{
    const parsedUrl = new URL(url);

    if(parsedUrl.hostname !== "github.com"){
        throw new Error("Only GitHub repositories are currently supported");
    }
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

    if(pathParts.length !== 2){
        throw new Error("Invalid GitHub URL format. Expected: https://github.com/{owner}/{repo}");
    }

    const [owner, repoName] = pathParts

    if (!owner || !repoName) {
        throw new Error("Invalid GitHub URL format. Missing owner or repository name.");
    }

    console.log(owner, repoName)

    return{
        owner,
        repoName
    }
    
}

//  get repo metadata from github API

async function getRepoInfo(info:RepoInfo){
    const {owner,repoName} = info

    const repoDetails = await octokit.request('GET /repos/{owner}/{repo}',{
        owner: owner,
        repo: repoName
    })

    return repoDetails.data
    
}
// get repo tree from github API
async function getRepoTree(owner: string, repo: string, branch: string): Promise<GitHubTreeEntry[]> {
    const response = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
        owner,
        repo,
        tree_sha: branch,
        recursive: '1'
    });

    return response.data.tree.map((file: any) => ({
        path: file.path,
        sha: file.sha,
        type: file.type as "blob" | "tree"
    }));
}


async function downloadBlob(owner: string, repo: string, file: GitHubTreeEntry) {
    const response = await octokit.request('GET /repos/{owner}/{repo}/git/blobs/{file_sha}', {
        owner,
        repo,
        file_sha: file.sha
    });

    if (response.data.encoding === 'base64') {
        return Buffer.from(response.data.content, 'base64').toString('utf-8');
    }

    return response.data.content;
}

export { extractRepoInfo, getRepoInfo, getRepoTree, downloadBlob }