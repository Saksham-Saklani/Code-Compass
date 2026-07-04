
import { URL } from "url";
import { Octokit} from "@octokit/core"

const octokit = new Octokit()

interface RepoInfo{
    owner: string,
    repoName: string
    }

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

export { extractRepoInfo, getRepoInfo }