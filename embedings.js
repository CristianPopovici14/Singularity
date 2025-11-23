/*
  embedings.js
  -------------
  Small helper that renders an embeddable preview for a project link.

  Behavior:
  - If the link is a YouTube URL, render an embedded player.
  - Otherwise attempt a generic iframe embed (may be blocked by X-Frame-Options).
*/

//--------------------------------------------------------------
// EMBED AUTOMÁTICO
//--------------------------------------------------------------
function renderEmbed() {
  if (!proj || !proj.link) return;

  const url = proj.link;

  // YouTube? extract video ID and embed
  if (url.includes("youtube.com/watch?v=") || url.includes("youtu.be/")) {

    let videoID = "";

    if (url.includes("watch?v=")) {
      videoID = url.split("watch?v=")[1].split("&")[0];
    }
    if (url.includes("youtu.be/")) {
      videoID = url.split("youtu.be/")[1].split("?")[0];
    }

    embedBox.innerHTML = `
      <div class="aspect-video">
        <iframe
          src="https://www.youtube.com/embed/${videoID}"
          frameborder="0"
          allowfullscreen
          class="w-full h-full">
        </iframe>
      </div>
    `;

    return;
  }

  // Generic embed — may be blocked by the remote site's headers
  embedBox.innerHTML = `
    <div class="w-full h-[600px]">
      <iframe src="${url}" class="w-full h-full"></iframe>
    </div>
  `;
}
