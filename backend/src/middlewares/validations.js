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

// Validation middleware
const validatePhoto = [
    check('photourl')
        .notEmpty()
        .withMessage('Photo URL is required')
        .isURL()
        .withMessage('Photo URL must be a valid URL'),
    check('name').notEmpty().withMessage('Name is required'),
    check('type')
        .notEmpty()
        .withMessage('Type is required')
        .isIn(['historical', 'recentEvents', 'families', 'single-photo'])
        .withMessage(
            'Type must be either "historical" or "recentEvents" or "families"'
        ),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    },
]

module.exports = { validateFamilyMember, validatePhoto }
