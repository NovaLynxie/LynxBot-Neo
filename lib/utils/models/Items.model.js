module.exports = {
	name: "Items",
	category: "Common",
	enabled:  false,
	define: (sequelize, DataTypes, tableName) => {
		return sequelize.define(tableName.toLowerCase(), {
			itemId: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV1,
				primaryKey: true,
			},
			itemName: {
				type: DataTypes.STRING,
				unique: true,
			},
			description: DataTypes.TEXT,
		});
	},
};
