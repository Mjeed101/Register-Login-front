
document.getElementById('tweetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const userid = localStorage.getItem('userId');
    const tweetContent = document.getElementById('tweetInput').value.trim();

    if(!tweetContent){
        showHomeMessage('Tweet cannot be empty','error');
        return;
    }

    fetch('http://127.0.0.1:8000/api/tweets',{
        method: 'POST',
        headers:{ 'Content-Type':'application/json'},
        body: JSON.stringify({user_id:userid,tweet_text:tweetContent})
    })
    .then(response => response.json())
    .then(data => {
        showHomeMessage(data.message,'success');
        document.getElementById('tweetInput').value = '';
        loadUserTweets();
    })
    .catch(error => {
    console.error('Error:',error);
    showHomeMessage('Somthing went wrong.Please try again later.','error');
});

});

function showHomeMessage(message, type) {
    let messageBox = document.getElementById('messageBox');

    messageBox.textContent = message;
    messageBox.style.color = type === 'error' ? 'red' : 'green';
    messageBox.style.marginBottom = '15px';
}
