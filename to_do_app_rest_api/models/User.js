import { DataTypes } from '../utils/MongoSequelize.js';
import { sequelize } from '../database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            if (value) {
                const hashedPassword = bcrypt.hashSync(value, 8);
                this.setDataValue('password', hashedPassword);
            }
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tokens: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false
    }
}, {
    timestamps: true,
    instanceMethods: {
        comparePassword: async function(candidatePassword) {
            return bcrypt.compare(candidatePassword, this.password);
        }
    }
});

User.associate = (models) => {
    User.hasMany(models.Todo, {
        foreignKey: 'owner',
        as: 'todos'
    });
};

export default User;
