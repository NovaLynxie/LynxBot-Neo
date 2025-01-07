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
            globalVoiceVolume: {
                defaultValue: false,
                type: DataTypes.INTEGER
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
