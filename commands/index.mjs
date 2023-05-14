async function sendFollowupMessage(interactionToken) {
    console.log("sending follow up message")
    const authConfig = {
      headers: {
        'Authorization': `Bot ${process.env.BOT_TOKEN}`
      }
    };
    const data = {
      "content": "UPDATED"
    }
  
    try {
      const url = `https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${interactionToken}`;
      return (await axios.post(url, data, authConfig)).status == 200;
    } catch (exception) {
      console.log(`There was an error posting a response: ${exception}`);
      return false;
    }
  }