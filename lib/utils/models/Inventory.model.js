module.exports = {
	name: "Inventory",
	category: "Community",
	enabled:  false,
	define: (sequelize, DataTypes) => {
		return sequelize.define(this.name.toLowerCase(), {
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
