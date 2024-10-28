// import octokit, { repoName, repoOwner } from "./getOctokit";

// type Base64 = string;
// type FileName = string;

// export default async function commitImagesToRepo(
//   imgs: Record<FileName, Base64 | undefined>,
//   commitMessage = " images",
// ) {
//   try {
//     const branch = "main";
//     const imageDir = "public/assets/covers";

//     // Step 1: Get the reference of the main branch
//     const { data: branchRef } = await octokit.git.getRef({
//       owner: repoOwner,
//       repo: repoName,
//       ref: `heads/${branch}`,
//     });

//     // Step 2: Get the current tree of the main branch
//     const { data: baseTree } = await octokit.git.getTree({
//       owner: repoOwner,
//       repo: repoName,
//       tree_sha: branchRef.object.sha,
//     });

//     console.log("Creating blobs");
//     // Step 3: Create blobs for each image and collect them
//     const blobsPromises = Object.entries(imgs)
//       .filter(([, base64]) => Boolean(base64))
//       .map(([fileName, base64]) => {
//         return octokit.git
//           .createBlob({
//             content: base64!,
//             owner: repoOwner,
//             repo: repoName,
//             encoding: "base64",
//           })
//           .then((blob) => ({
//             path: `${imageDir}/${fileName}.png`,
//             mode: "100644" as const,
//             type: "blob" as const,
//             sha: blob.data.sha,
//           }));
//       });

//     const blobs = await Promise.all(blobsPromises);

//     console.log("Creating tree");
//     // Step 4: Create a new tree that includes the new images
//     const { data: newTree } = await octokit.git.createTree({
//       owner: repoOwner,
//       repo: repoName,
//       base_tree: baseTree.sha,
//       tree: blobs,
//     });

//     console.log("Creating commit");

//     // Step 5: Create a new commit
//     const { data: newCommit } = await octokit.git.createCommit({
//       owner: repoOwner,
//       repo: repoName,
//       message: commitMessage,
//       tree: newTree.sha,
//       parents: [branchRef.object.sha],
//     });

//     console.log("Updating reference");
//     // Step 6: Update the reference of the main branch to point to the new commit
//     await octokit.git.updateRef({
//       owner: repoOwner,
//       repo: repoName,
//       ref: `heads/${branch}`,
//       sha: newCommit.sha,
//     });

//     console.log(`Images committed and pushed to the ${branch} branch.`);
//     return { success: true };
//   } catch (error) {
//     console.error("Error:", error);
//     return { success: false };
//   }
// }

export default {};
