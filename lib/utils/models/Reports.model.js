module.exports = {
	name: "Reports",
	category: "Support",
	enabled:  false,
	define(sequelize, DataTypes, tableName) {
		return sequelize.define(tableName.toLowerCase(), {
			reportId: {
				allowNull: false,
				autoIncrement: true,
				type: DataTypes.INTEGER,
				primaryKey: true,
			},
			reportState: {
				allowNull: false,
				defaultValue: "OPEN",
				type: DataTypes.STRING,
			},
			reportTitle: DataTypes.STRING,
			reportDetails: DataTypes.TEXT,
			targetUserId: DataTypes.STRING, 
			authorUserId: DataTypes.STRING,
			category: DataTypes.STRING,
			channelId: DataTypes.STRING,
			threadId: DataTypes.STRING,
		});
	},
};
