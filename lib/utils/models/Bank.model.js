module.exports = {
	name: "Bank",
	category: "Economy",
	enabled:  false,
	define(sequelize, DataTypes, tableName) {
		return sequelize.define(tableName.toLowerCase(), {
			userId: {
				type: DataTypes.STRING,
				primaryKey: true,
			},
			accountType: DataTypes.STRING,
			balance: DataTypes.DECIMAL(10, 2),
		});
	},
};
