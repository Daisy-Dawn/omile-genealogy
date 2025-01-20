const { check, validationResult } = require('express-validator')

const validateFamilyMember = [
    check('name').notEmpty().withMessage('Name is required'),
    check('descendants.marriedTo')
        .optional()
        .isArray()
        .withMessage('Married-to must be a string'),
    check('descendants.children')
        .optional()
        .isArray()
        .withMessage('Children must be an array'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    },
]

module.exports = { validateFamilyMember }
