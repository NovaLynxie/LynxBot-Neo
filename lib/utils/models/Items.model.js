module.exports = {
	name: "Items",
	category: "Common",
	enabled:  false,
	define: (sequelize, DataTypes) => {
		return sequelize.define(this.name.toLowerCase(), {
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
