module.exports = {
	name: "Music",
	category: "Voice",
	enabled:  true,
	define: (sequelize, DataTypes, tableName) => {
		console.log(this);
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
			url: {
				allowNull: false,
				type: DataTypes.STRING
			},
			source: {
				defaultValue: "N/A",
				type: DataTypes.STRING,
			},
		});
	},
};
