module.exports = {
	name: "Settings",
	category: "Common",
	enabled:  true,
	define: (sequelize, DataTypes, tableName) => {
		return sequelize.define(tableName.toLowerCase(), {
            guildId: {
                allowNull: false,
                type: DataTypes.STRING,
                primaryKey: true,
            },
            // guild settings
            useExperimentalProfile: {
				defaultValue: false,
                type: DataTypes.BOOLEAN,
            },
            useCapslockSpamFilter: {
                defaultValue: false,
                type: DataTypes.BOOLEAN,
            },
            useMessageContextAnalysis: {
                defaultValue: false,
                type: DataTypes.BOOLEAN,
            },
            globalVoiceVolume: {
                defaultValue: 50,
                type: DataTypes.INTEGER,
            },
            blacklistedKeywords: {
                defaultValue: "",
                type: DataTypes.STRING,
                allowNull: false,
                get() {
                    return this.getDataValue("blacklistedKeywords").split(";")
                },
                set(val) {
                    this.setDataValue("blacklistedWords", val.join(";"))
                },
            },
            capslockSpamFilterThreshold: {
                defaultValue: 75,
                type: DataTypes.INTEGER,
            },
            // guild log channels
            announcerChannel: DataTypes.STRING,
            defaultChannel: DataTypes.STRING,
            moderationChannel: DataTypes.STRING,
            // server staff channels
            staffChannel: DataTypes.STRING,
            // support system channels
            reportsChannel: DataTypes.STRING,
            ticketsChannel: DataTypes.STRING,
            // support system messages
            reportsPromptId: DataTypes.STRING,
            ticketsPromptId: DataTypes.STRING,
            // server role ids
            staffDefaultRole: DataTypes.STRING,
            reportsModRole: DataTypes.STRING,
            ticketsModRole: DataTypes.STRING,
        })
	},
};
