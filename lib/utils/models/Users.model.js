module.exports = {
	name: "Users",
	category: "Common",
	enabled:  true,
	define (sequelize, DataTypes) {
		return sequelize.define(this.name.toLowerCase(), {
			userId: {
				allowNull: false,
				type: DataTypes.STRING,
				primaryKey: true,
			},
			blacklist: {
				defaultValue: false,
				type: DataTypes.BOOLEAN
			},
			birthday: DataTypes.DATE,
			dailyDate: DataTypes.DATE,
			language: DataTypes.STRING
		},
		{
			paranoid: true
		});
	},
};
