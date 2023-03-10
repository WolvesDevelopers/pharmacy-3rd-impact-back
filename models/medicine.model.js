'use strict'

module.exports = (sequelize, Sequelize) => {
	const Medicine = sequelize.define('Medicine',{
		MID:{
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		LID:{
			type: Sequelize.INTEGER,
			allowNull: false,
			require: true
		},
		code:{
			type: Sequelize.STRING(15),
			allowNull: false,
			unique:true,
			require: true
		},
		name:{
			type: Sequelize.STRING(50),
			allowNull: false,
			require: true
		},
		desc:{
			type: Sequelize.STRING(100),
			allowNull: false,
			require: true	
		},
		presentation:{
			type: Sequelize.STRING(100),
			allowNull: false,
			require: true
		},
		status:{
			type: Sequelize.BOOLEAN,
			require: true
		},
	},{
		timestamps: false
	})

	Medicine.associate = function (models) {
		Medicine.hasMany(models.Inventory, { foreignKey: 'MID' })
		Medicine.hasOne(models.Laboratory, { foreignKey: 'LID'})
	}
	
	return Medicine;
}