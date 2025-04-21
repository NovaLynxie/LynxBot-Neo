const { tickets } = require("../../assets/schemas/support.json");
module.exports = {
	name: "Tickets",
	category: "Support",
	enabled:  true,
	define(sequelize, DataTypes) {
		return sequelize.define(this.name.toLowerCase(), {
			ticketId: {
				allowNull: false,
				autoIncrement: true,
				type: DataTypes.INTEGER,
				primaryKey: true,
			},
			ticketState: {
				allowNull: false,
				defaultValue: "ACTIVE",
				type: DataTypes.STRING
				//type: DataTypes.ENUM,
				//values: Object.keys(tickets.states) ?? []
			},
			ticketTitle: DataTypes.STRING,
			category: DataTypes.STRING,
			channelId: DataTypes.STRING,
			threadId: DataTypes.STRING,
			authorId: DataTypes.STRING,
		});
	},
};
