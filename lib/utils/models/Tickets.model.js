module.exports = {
	name: "Tickets",
	category: "Support",
	enabled:  false,
	define(sequelize, DataTypes, tableName) {
		return sequelize.define(tableName.toLowerCase(), {
			ticketId: {
				allowNull: false,
				autoIncrement: true,
				type: DataTypes.INTEGER,
				primaryKey: true,
			},
			ticketState: {
				allowNull: false,
				defaultValue: "OPEN",
				type: DataTypes.STRING,
			},
			ticketTitle: DataTypes.STRING,
			category: DataTypes.STRING,
			channelId: DataTypes.STRING,
			threadId: DataTypes.STRING,
			authorId: DataTypes.STRING,
		});
	},
};