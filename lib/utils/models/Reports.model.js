const { reports } = require("../../assets/schemas/support.json");
module.exports = {
	name: "Reports",
	category: "Support",
	enabled:  false,
	define (sequelize, DataTypes) {
		return sequelize.define(this.name.toLowerCase(), {
      reportId: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      reportState: {
        allowNull: false,
        defaultValue: reports.states.OPEN ?? "OPEN",
        type: DataTypes.ENUM, // DataTypes.STRING
        values: Object.keys(reports.states) ?? [
			"OPEN", "RESOLVED", "CLOSED", "LOCKED" // fallback values in case schema is missing
		],
      },
      reportTitle: DataTypes.STRING,
      reportDetails: DataTypes.TEXT,
      targetUserId: DataTypes.STRING,
      authorUserId: DataTypes.STRING,
      category: {
        allowNull: false,
        defaultValue: reports.categories.other,
        type: DataTypes.ENUM, // DataTypes.STRING,
        values: Object.keys(reports.categories) ?? [
			"general", "spam_content", "rule_violation", "other" // fallback values in case schema is missing
		],
      },
      channelId: DataTypes.STRING,
      threadId: DataTypes.STRING,
    });
	},
};
