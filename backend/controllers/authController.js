const User = require('../models/User');
const Tenant = require('../models/Tenant');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, tenantName } = req.body;
        const normalizedTenantName = tenantName.trim().toLowerCase();

        let tenant = await Tenant.findOne({ name: normalizedTenantName });
        if (!tenant) {
            tenant = await Tenant.create({ name: normalizedTenantName });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            tenantId: tenant._id
        });

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
