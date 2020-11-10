module.exports = {
    theme: {
        spinner: (theme) => ({
            default: {
                color: theme('colors.white'),
                size: '1em',
                border: '2px',
                speed: '500ms'
            }
        })
    },
    variants: {
        display: ['responsive', 'group-hover'],
        opacity: ['disabled'],
        backgroundColor: ['disabled', 'hover'],
        textColor: ['responsive', 'hover'],
        cursor: ['disabled', 'hover'],
        spinner: ['responsive']
    },
}