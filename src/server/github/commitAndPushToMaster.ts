import octokit, { repoName, repoOwner } from "./getOctokit";

export default async function commitAndPushToMaster(
  filePath: string,
  newContent: string,
  commitM?: string,
) {
  try {
    const commitMessage = commitM ?? `Update atuomatically in ${filePath}`,
      { data: branchRef } = await octokit.git.getRef({
        owner: repoOwner,
        repo: repoName,
        ref: "heads/main",
      }),
      // Step 2: Get the current tree of the master branch
      { data: baseTree } = await octokit.git.getTree({
        owner: repoOwner,
        repo: repoName,
        tree_sha: branchRef.object.sha,
      }),
      // Step 3: Create a new blob with the updated content
      { data: newBlob } = await octokit.git.createBlob({
        owner: repoOwner,
        repo: repoName,
        content: newContent,
        encoding: "utf-8",
      }),
      // Step 4: Create a new tree that includes the updated file
      newTree = await octokit.git.createTree({
        owner: repoOwner,
        repo: repoName,
        base_tree: baseTree.sha,
        tree: [
          {
            path: filePath,
            mode: "100644", // File mode
            type: "blob",
            sha: newBlob.sha, // SHA of the updated content
          },
        ],
      }),
      // Step 5: Create a new commit
      { data: newCommit } = await octokit.git.createCommit({
        owner: repoOwner,
        repo: repoName,
        message: commitMessage, // Commit message
        tree: newTree.data.sha,
        parents: [branchRef.object.sha], // Include the previous commit as a parent
      });

    // Step 6: Update the reference of the main branch to point to the new commit
    await octokit.git.updateRef({
      owner: repoOwner,
      repo: repoName,
      ref: "heads/main",
      sha: newCommit.sha,
    });

    console.log("File updated and committed to the main branch.");

    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false };
  }
}
