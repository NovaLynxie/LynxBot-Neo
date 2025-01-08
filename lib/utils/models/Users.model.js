module.exports = {
	name: "Users",
	category: "Common",
	enabled:  true,
	define: (sequelize, DataTypes) => {
		return sequelize.define(this.name.toLowerCase(), {
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
