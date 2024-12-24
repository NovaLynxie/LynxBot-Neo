module.exports = {
	name: "Inventory",
	category: "Community",
	enabled:  false,
	define: (sequelize, DataTypes, tableName) => {
		return sequelize.define(tableName.toLowerCase(), {
			userId: {
				type: DataTypes.STRING,
				primaryKey: true,
			},
			itemId: {
				type: DataTypes.UUID,
				unique: true,
			},
			amount: DataTypes.INTEGER(11),
		});
	},
};
