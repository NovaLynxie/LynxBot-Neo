module.exports = {
	name: "Music",
	category: "Voice",
	enabled:  false,
	define: (sequelize, DataTypes, tableName) => {
		return sequelize.define(tableName.toLowerCase(), {
			guildId: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			memberId: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			title: {
				defaultValue: "Unknown",
				type: DataTypes.STRING,
			},
			duration: {
				defaultValue: 0,
				type: DataTypes.INTEGER
			},
			source: {
				defaultValue: "Unknown",
				type: DataTypes.STRING,
			},
		});
	},
};
