module.exports = {
	name: "Profiles",
	category: "Community",
	enabled:  false,
	define: (sequelize, DataTypes) => {
		return sequelize.define(this.name.toLowerCase(), {
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
