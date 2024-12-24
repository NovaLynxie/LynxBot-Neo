module.exports = {
	name: "Profiles",
	category: "Community",
	enabled:  false,
	define: (sequelize, DataTypes, tableName) => {
		return sequelize.define(tableName.toLowerCase(), {
            profileId: {
                allowNull: false,
                defaultValue: DataTypes.UUIDV1,
                type: DataTypes.UUID,
                primaryKey: true,
            },
            guildId: {
                unique: true,
                type: DataTypes.STRING,
            },
            userId: DataTypes.STRING,
            nickname: DataTypes.STRING,
            pronouns: DataTypes.STRING,
            userBio: {
                allowNull: false,
                defaultValue: "No user bio description provided.",
                type: DataTypes.TEXT,
            },
        })
	},
};
