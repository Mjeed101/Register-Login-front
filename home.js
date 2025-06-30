async function loadTimeline() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/timeline", {
      method: "GET",
      headers: {
         "Content-Type": "application/json" ,
       Accept: "application/json" ,
    },
});
    const tweets = await res.json();

    const container = document.getElementById("timeline");
    container.innerHTML = ""; // clear

    tweets.forEach((t) => {

      console.log(t);
      const div = document.createElement("div");
      div.className = "tweet";
      div.innerHTML = `
            <h4>${t.name}</h4>
            <p>${t.content}</p>
            <time>${t.date}</time>
            <button onclick="deleteTweet(${t.id})">Delete</button>
          `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load timeline", err);
    document.getElementById("timeline").textContent = "Error loading timeline.";
  }
}

async function deleteTweet(tweetId) {  


  if (confirm('Are you sure you want to delete this tweet?')) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tweets/${tweetId}`, {  // tweetId here is correct now
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({userId:localStorage.getItem('userId')})
      });

      const data = await res.json();
      alert(data.message);
      loadTimeline();
    } catch (err) {
      console.error('Error deleting tweet', err);
      alert('Error deleting tweet');
    }
  }
}


document.addEventListener("DOMContentLoaded", loadTimeline);

// redirect if not logged in
if (!localStorage.getItem("userId")) {
  window.location.href = "index.html";
}

// handle logout via POST, then clear storage + redirect
document.getElementById("logoutButton").addEventListener("click", async () => {
  try {
    await fetch("/logout", { method: "POST" });
  } catch (e) {
    /* ignore network errors */
  }
  localStorage.clear();
  window.location.href = "index.html";
});

// submit tweets to your Laravel route
document.getElementById("tweetForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = document.getElementById("tweetInput").value.trim();
  if (!content) return;

  try {
    const res = await fetch("http://127.0.0.1:8000/api/tweets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId: localStorage.getItem("userId") }),
    });
    const data = await res.json();

    if (data.success) {
      // clear textarea & show message
      document.getElementById("tweetInput").value = "";
      document.getElementById("messageBox").textContent = "Tweet posted!";

      loadTimeline();
    } else {
      document.getElementById("messageBox").textContent =
        "Failed to post tweet.";
    }
  } catch (err) {
    document.getElementById("messageBox").textContent = "Error posting tweet.";
  }
});
