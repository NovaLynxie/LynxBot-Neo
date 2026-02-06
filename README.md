# LynxBot "Neo"
My personal DiscordJS bot. Built to run on Discord.JS v14.
## Dependencies
- NodeJS v22 or above
- windows-build-tools (for windows only!)
- FFMPEG any version (required for audio functionality!)

## Getting Started
To get started, please install the required [system dependencies](#dependencies) before proceeding.
You will also need to create a discord application bot user at the Discord Developers applications page [here](https://discord.com/developers/applications) and generate your unique application token.
### Warning!
Do not share your bot token to **anyone**, including trusted friends or share it publicly in your code!
This is your authentication token to allow your application to interact with discord's api directly, therefore it is your responsibility to ensure it is securely stored. Neither I (NovaLynxie) or Discord will be held responsible for you failing to keep your token safe. If you feel that your application has been compromised, or your bot's token has been leaked in any way, please go to your application in Discord Developer's dashboard and reset it immediately.

## F.A.Q.
### NodeJS "node" command is not recognised error / I installed nodejs but my command terminal does not recognise it?
You have either not installed NodeJS or your PATH env variable has somehow not been setup correctly.
1. Please try uninstalling and reinstalling NodeJS and ensure that the option to add Node.js to the PATH is checked. 
2. If you are using `nvm` for managing node installations or "nvm for windows" for windows users, open a terminal and run `nvm install 22.22.0` then `nvm use 22.22.0` to use this version.
Once you have finished reinstalling node, open your terminal and check using `node --version`, it should return a version number.
I won't offer support for broken or incorrect PATH envrionment variables, there are plenty of guides online to help with this. Try looking up "node not recognised but already installed".
### The bot fails to start-up properly. What do I do?
Check the console or logs for errors and ensure your code is free of syntax errors. If all else fails reinstall your dependencies by running `npm clean-install` or delete the `node_modules` folder and run `npm install` to setup your apps dependencies again.
### Some dependencies such as "sqlite3" "sodium" module fails to install, why can I not install it?
~~You must have "windows-build-tools" installed, however, newer versions of NodeJS come with their own build tools built-in.~~  
See known dependency insta;lation issues [here](#known-dependencies-that-fail-install).
#### Known Dependency Installation Issues
These are the currently known issues which are updated each time I discover a depenedny that refuses to install correctly.  
If the dependency you are having trouble installing is not listed here, try running `npm cleaninstall` or delete the `./node_modules/` folder and run `npm install`. Should it still continue to fail to install then please open an issue ticket so I can look into it.
- `sodium`  
  This module has been replaced with sodium-native, however you can install sodium if you want better performance.
- `sqlite3`  
  This requires running `npm install sqlite3 --build-from-source=false` to install correctly and must be done *before* installing everything else.

#### *Legacy Information for Windows Users*
***This no longer applies since newer Node.js installers for windows now have an option to help install VS build tools as part of your setup.***  
For Windows users, please go to your installation's directory and run the "install_tools.bat" or similar for your installation.  
Once this has completed successfully, reboot your system if required to do so then re-run the installation again using the method described in "The bot fails to start-up properly. What do I do?" and it should install correctly.

### I have tried the above step, but my bot still refuses to start-up correctly!
If reinstalling fails and you are sure you have installed dependencies correctly, please leave an issue ticket and I will get back to you as soon as possible.

### Can I contribute to provide bug fixes, patches, or make feature requests?
Not directly for this bot, since this is a private application that I build as a personal project. However, it is based of my own custom framework which you can offer patches to in fixing issues that may come up! You can find it [here](https://github.com/NovaLynxie/discordjs-bot-template-v14), though please note it may not be as updated as the active bot version since I don't frequently maintain that and only update as necessary.  
As for this bot, if you do find any issues while running it, please open a issue ticket to describe the problem or open a pull request explaining your proposed changes and I will try to respond where possible.  
I do however ask that you only use pull requests for feature requests or urgent patches as not all requests may be possible or may only be unique to your use-case. If you are unsure of this, please create an issue ticket and I'll get back to you as soon as I can.