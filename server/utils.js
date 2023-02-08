const config = require("../config/config.js");
const axios = require('axios');
var https = require('https');
const chalk = require('chalk');
const User = require('./models/user.js');
const Tag = require('./models/tag.js');
const Announcement = require('./models/announcement.js');
const fs = require('fs');
const { Utils } = require("discord.js");


//==========================================//
//   Exchanging Proof for an Access Token   //
//==========================================//

exports.exchangeForTokens = async (userID, exchangeProof) => {
	try {
		const token = await axios.request({
			url: "/token",
			method: "post",
			baseURL: "https://login.iee.ihu.gr/",
			data: exchangeProof
		}).then(function(res) {
			return res.data;
		});

		const tags = await this.getUserTags(token.access_token);
		
		// Usually, this token data should be persisted in a database and associated with a user identity.
		const user = await User.findOne({ userId: userID });
		if (user) {
			//User exists
			user.accessToken = token.access_token;
			user.refreshToken = token.refresh_token;
			user.expiresAt = new Date(Date.now() + 102000);
			user.tags = tags;
			user.save();
		} else {
			//User doesn't exist
			//expires after 2 minutes
			const newUser = new User({
				guild_id: config.GuildID,
				userId: userID,
				accessToken: token.access_token,
				refreshToken: token.refresh_token,
				expiresAt: new Date(Date.now() + 102000), //96000ms = 1.7m
				tags: tags
			});
			newUser.save();
		}
		
		// refreshTokenStore[userId] = token.refresh_token;
		// accessTokenCache.set(userId, token.access_token, 110); //token expires after 2 minutes
  
		console.log(chalk.green('       > Received an access token and refresh token'));
		return token.access_token;
	} catch (e) {
		return console.log(e);
		// console.error(chalk.red(`       > Error exchanging ${exchangeProof.grant_type} for access token`));
		// return JSON.parse(e.response.body);
	}
};
  
exports.refreshAccessToken = async (userId) => {
	//get userID's refresh token
	const user = await User.findOne({ userId: userId });
	if (user) {
		//User exists
		// console.log('User exists, updating..');
		const refreshToken = user.refreshToken;

		const refreshTokenProof = {
			grant_type: 'refresh_token',
			client_id: config.ihu_app.CLIENT_ID,
			client_secret: config.ihu_app.CLIENT_SECRET,
			code: refreshToken
		};

		return await module.exports.exchangeForTokens(userId, refreshTokenProof);
	} else {
		//User doesn't exist
		console.log(chalk.red(`       > User ${userId} doesn't exist in the database`));
		return;
	}
};
  
exports.getAccessToken = async (userId) => {
	//check if token expired, and if so refresh it
	const user = await User.findOne({ userId });
	if (user) {
		const expiresAt = user.expiresAt;
		const dateNow = new Date();
		if (dateNow < expiresAt) {
			console.log("getAccessToken: User is authorized");
			const access_token = user.accessToken;
			return access_token;
		} else {
			console.log("getAccessToken: User expired");
			return await module.exports.refreshAccessToken(userId);
		}
	} else {
		console.log("getAccessToken: User not found");
	}

};

exports.usersExist = async () => {
	const users = await User.find();
    if (users.length > 0) {
        return true;
    } else {
        return false;
    }
};

exports.getRandomAccessToken = async () => {
	const users = await User.find({ accessToken: { $exists: true } });
	const randomUser = users[Math.floor(Math.random() * users.length)];
	console.log(`Using ${randomUser.userId}'s access token`);
	const accesstoken = await module.exports.getAccessToken(randomUser.userId)
	return accesstoken;
};
  
exports.isAuthorized = (userId) => {
	const user = User.findOne({ userId: userId });
	if (user) {
			console.log("isAuthorized: User exists");
			return true;
		} else {
			console.log("isAuthorized: User does not exist");
			return false;
		}
};
  
//====================================================//
//   Using an Access Token to Query the APPS API   //
//====================================================//
  
exports.getProfile = async (accessToken) => {
	try {
		const conf = {
			headers:{
				'x-access-token': `${accessToken}`,
				'Content-Type': 'application/json'
			}
		};

		const profile = await axios.get('https://api.iee.ihu.gr/profile', conf).then((res) => {
			return res.data;
		});
	
		return profile;
  
	} catch (err) {
		console.error(chalk.red('  > Unable to retrieve profile'));
		return err;
	}
};
  
exports.getAnnouncements = async (accessToken) => {
	try {
		const conf = {
			headers:{
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		};

		const announcements = await axios.get('https://aboard.iee.ihu.gr/api/announcements?page=1&perPage=4&sortId=1', conf).then((res) => {
			return res.data;
		});
		
		console.log(chalk.green(`       > Received ${announcements.length} announcements`));
		return announcements;
	
	} catch (e) {
		console.error(chalk.red('  > Unable to retrieve announcements'));
		return e;
	}
};


exports.getAllTags = async (accessToken) => {
	try {
		const config = {
			headers:{
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		};

		const tags = await axios.get('https://aboard.iee.ihu.gr/api/tags', config).then((res) => {
			return res.data;
		});

		console.log(chalk.green(` > Received ${tags.data.length} tags`));

		//for each tag, check if it exists in the database and if not, add it
		tags.data.forEach(async (tag) => {
			const tagExists = await Tag.findOne({ id: tag.id });
			if (!tagExists) {
				const newTag = new Tag({
					_id: tag.id,
					title: tag.title,
					parent_id: tag.parent_id,
					is_public: tag.is_public,
					maillist_name: tag.maillist_name
				});
				await newTag.save().then((tag) => {
					console.log(chalk.green(`Added tag "${tag.title}" to the database`));
				});
			} else {
				console.log(chalk.red(`Tag ${tag.title} already exists in the database`));
			} 
		});

		return;
	
	} catch (e) {
		console.error(chalk.red('  > Unable to retrieve tags'));
		return e;
	}
};


exports.getAllAnnouncements = async (accessToken) => {
	try {
		const config = {
			headers:{
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		};

		const announcements = await axios.get('https://aboard.iee.ihu.gr/api/announcements?page=1&perPage=6&sortId=1', config).then((res) => {
			return res.data;
		});

		//Create empty array for new announcements
		let newAnnouncements = [];

		//Add each announcement to DB
		for (const announcement of announcements.data) {
			const announcementExists = await Announcement.findOne({ id: announcement.id });
			if (!announcementExists) {
				new Announcement({
					id: announcement.id,
					title: announcement.title,
					eng_title: announcement.eng_title,
					body: announcement.body,
					eng_body: announcement.eng_body,
					created_at: announcement.created_at,
					updated_at: announcement.updated_at,
					tags: announcement.tags,
					attatchments: announcement.attatchments,
					author: announcement.author
				}).save().then((announcement) => {
					console.log(chalk.green(`Added announcement "${announcement.title}" to the database`));
					// console.log(`Got ${newAnnouncements.length} new announcements`);
				});

				//add announcement to newAnnouncements array
				newAnnouncements.push(announcement);

			}
		};

		

		//if newAnnouncements is not empty
		if (newAnnouncements.length > 0) {
			console.log(`Got ${newAnnouncements.length} new announcements`);
			return newAnnouncements;
		} else {
			console.log(`No new announcements`);
			return [];
		}
	
	} catch (e) {
		console.error(chalk.red('  > Unable to retrieve announcements'));
		console.error(e);
		return e;
	}
};

exports.downloadAttachment = async (accessToken, annID, filename, attURL) => {
	// download attachment, and save it to ./attachments/announcementID/filename
	try {
		const conf = {
            headers:{
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

		const attDir = `./server/public/attachments/${annID}`;

		//check if attachment directory exists
		if (!fs.existsSync(attDir)) {
			fs.mkdirSync(attDir);
		}

		//download attachment with stream
		const att = await axios({
			method: 'get',
            url: attURL,
            responseType:'stream',
            headers: conf.headers
			}).then((res) => {
                return res.data;
			});
		
		//save attachment
		att.pipe(fs.createWriteStream(`${attDir}/${filename}`));
        console.log(chalk.green(`  > Attachment ${filename} downloaded`));
        return;
		
		
	} catch (e) {
		console.error(chalk.red(`  > Unable to download attachment ${filename}`));
		console.error(e);
		return e;
	}
}

exports.getUserTags = async (accessToken) => {
	try {
		const config = {
			headers:{
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		};

		const tags = await axios.get('https://aboard.iee.ihu.gr/api/auth/subscriptions', config).then((res) => {
			return res.data;
		});

		const list = [];

		tags.forEach((tag) => {
			list.push(tag.id);
		});

		return list;
	
	} catch (e) {
		console.error(chalk.red('  > Unable to retrieve tags'));
		return e;
	}
};

exports.subscribe = async (accessToken, tags) => {

	try {
		const config = {
			headers:{
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		};

		console.log(tags);
		await axios.post('https://aboard.iee.ihu.gr/api/auth/subscribe', { tags: `[${tags}]` }, config);

		console.log(chalk.green(`  > Subscribed to tags`));

		return;
	
	} catch (e) {
		console.error(chalk.red('  > Unable to retrieve tags'));
		return e;
	}
}

exports.saveBase64Image = async (base64Image, annID, filename) => {
    try {
        const filePath = `./server/public/attachments/${annID}`;
		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath);
		}

        const buffer = Buffer.from(base64Image, 'base64');
		fs.writeFile(`${filePath}/${filename}`, buffer, (err => {
				if (err) {
					return err;
				}
			}))
        console.log(chalk.green(`  > Image saved to ${filePath}`));
        return;
    
    } catch (e) {
        console.error(chalk.red('  > Unable to save image'));
        console.error(e);
        return e;
    }
}