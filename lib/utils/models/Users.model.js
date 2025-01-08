module.exports = {
	name: "Users",
	category: "Common",
	enabled:  true,
	define: (sequelize, DataTypes, tableName) => {
		return sequelize.define(tableName.toLowerCase(), {
			userId: {
				allowNull: false,
				type: DataTypes.STRING,
				primaryKey: true,
			},
			dailyDate: DataTypes.DATE,
			birthday: DataTypes.DATE,
		});
	},
};
