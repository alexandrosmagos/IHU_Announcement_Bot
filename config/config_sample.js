module.exports = {

  Prefix: "!",
  Status: "development",
  GuildID: "", //Guild ID for the discord server

  Handlers: {
    MONGO: "mongodb+srv://xxx" //MongoDB url
  },

  Client: { //Discord bot token and ID
    TOKEN: "",
    ID: ""
  },

  ihu_app: { // APPS application
    CLIENT_ID: "",
    CLIENT_SECRET: "",
    SCOPES: "announcements,notifications",
    REDIRECT_URI: "https://example.com/callback"
  },

  announcements: { //Where to send all new announcements, and role ID to give to newly authenticated users
    send_all_channelID: "",
    auth_role: ""
  },

  contact: { //For the site's contact form. Recaptcha secret, and channelID to send the forms to
    g_secretKey: "",
    contact_form_channel: ""
  }

}
