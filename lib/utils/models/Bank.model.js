module.exports = {
	name: "Bank",
	category: "Economy",
	enabled:  false,
	define(sequelize, DataTypes) {
		return sequelize.define(this.name.toLowerCase(), {
			userId: {
				type: DataTypes.STRING,
				primaryKey: true,
			},
			accountType: DataTypes.STRING,
			balance: DataTypes.DECIMAL(10, 2),
		});
	},
};
