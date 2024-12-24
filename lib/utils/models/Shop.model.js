module.exports = {
	name: "Shop",
	category: "Economy",
	enabled:  false,
	define(sequelize, DataTypes, tableName) {
		return sequelize.define(tableName.toLowerCase(), {
			listingId: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV1,
				primaryKey: true,
			},
			itemId: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV1,
				unique: true,
			},
			sellerId: DataTypes.STRING,
			amount: DataTypes.INTEGER(11),
			price: DataTypes.DECIMAL(10, 2),
		});
	},
};
